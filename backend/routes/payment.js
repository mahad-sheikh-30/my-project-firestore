const express = require("express");
const Stripe = require("stripe");
const auth = require("../middleware/auth");

const router = express.Router();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const { db, admin } = require("../firestore");

router.post("/create-payment-intent", auth, async (req, res) => {
  try {
    const { courseId } = req.body;
    const userId = req.user?.uid;

    if (!courseId) return res.status(400).json({ error: "courseId required" });
    if (!userId)
      return res.status(401).json({ error: "User not authenticated" });

    const courseSnap = await db.collection("courses").doc(courseId).get();
    if (!courseSnap.exists)
      return res.status(404).json({ error: "Course not found" });

    const course = courseSnap.data();

    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(course.price * 100),
      currency: "usd",
      metadata: { userId, courseId },
      automatic_payment_methods: { enabled: true },
    });

    res.send({ clientSecret: paymentIntent.client_secret });
  } catch (err) {
    console.error("Payment intent error:", err.message);
    res.status(500).json({ error: "Payment intent creation failed" });
  }
});

const handleWebhook = async (req, res) => {
  const sig = req.headers["stripe-signature"];
  const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

  let event;
  try {
    event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
  } catch (err) {
    console.error("Webhook signature error:", err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  const enrollmentsRef = db.collection("enrollments");
  const coursesRef = db.collection("courses");
  const usersRef = db.collection("users");
  const transactionsRef = db.collection("transactions");

  if (event.type === "payment_intent.succeeded") {
    const session = event.data.object;
    const { userId, courseId } = session.metadata;

    try {
      const existingTxSnap = await transactionsRef
        .where("paymentIntentId", "==", session.payment_intent || session.id)
        .get();

      if (!existingTxSnap.empty) {
        console.log("Transaction already exists");
      } else {
        await transactionsRef.add({
          userId,
          courseId,
          stripeSessionId: session.id,
          paymentIntentId: session.payment_intent || session.id,
          amount: session.amount_total / 100,
          paymentMethod: session.payment_method_types?.[0] || "card",
          createdAt: admin.firestore.Timestamp.now(),
        });

        const existingEnrollSnap = await enrollmentsRef
          .where("userId", "==", userId)
          .where("courseId", "==", courseId)
          .get();

        if (existingEnrollSnap.empty) {
          await enrollmentsRef.add({
            userId,
            courseId,
            enrolledAt: admin.firestore.Timestamp.now(),
          });

          await coursesRef
            .doc(courseId)
            .update({ studentsCount: admin.firestore.FieldValue.increment(1) });

          await usersRef.doc(userId).update({ role: "student" });

          console.log(`Enrollment + Transaction saved for user: ${userId}`);
        } else {
          console.log("User already enrolled");
        }
      }
    } catch (err) {
      console.error("Webhook processing error:", err.message);
    }
  }

  res.status(200).send();
};

module.exports = router;
module.exports.handleWebhook = handleWebhook;
