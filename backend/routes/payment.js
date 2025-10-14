const express = require("express");
const Stripe = require("stripe");
const auth = require("../middleware/auth");
const Enrollment = require("../models/enrollment");
const Course = require("../models/course");
const { User } = require("../models/user");
const Transaction = require("../models/transaction");

const router = express.Router();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

router.post("/create-checkout-session", auth, async (req, res) => {
  try {
    const { courseId } = req.body;
    const userId = req.user._id;

    if (!courseId) {
      return res.status(400).json({ error: "courseId required" });
    }

    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ error: "Course not found" });
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: { name: course.title },
            unit_amount: course.price * 100,
          },
          quantity: 1,
        },
      ],
      success_url: `${process.env.FRONTEND_URL}/success?courseId=${courseId}`,
      cancel_url: `${process.env.FRONTEND_URL}`,
      metadata: { userId: userId.toString(), courseId: courseId.toString() },
    });

    res.json({ url: session.url });
  } catch (err) {
    console.error("Stripe session error:", err.message);
    res.status(500).json({ error: "Payment session failed" });
  }
});

router.post("/create-payment-intent", auth, async (req, res) => {
  try {
    const { courseId } = req.body;
    const userId = req.user._id;

    if (!courseId) return res.status(400).json({ error: "courseId required" });

    const course = await Course.findById(courseId);
    if (!course) return res.status(404).json({ error: "Course not found" });

    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(course.price * 100),
      currency: "usd",
      metadata: { userId: userId.toString(), courseId: courseId.toString() },
      automatic_payment_methods: { enabled: true },
    });

    res.send({
      clientSecret: paymentIntent.client_secret,
    });
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

  if (event.type === "checkout.session.completed") {
    const session = event.data.object;
    const { userId, courseId } = session.metadata;

    try {
      const alreadyExists = await Transaction.findOne({
        stripeSessionId: session.id,
      });
      if (!alreadyExists) {
        const course = await Course.findById(courseId);
        await Transaction.create({
          userId,
          courseId,
          stripeSessionId: session.id,
          paymentIntentId: session.payment_intent,
          amount: course.price,
          paymentMethod: session.payment_method_types[0],
        });
        const existing = await Enrollment.findOne({ userId, courseId });
        if (!existing) {
          await Enrollment.create({ userId, courseId });
          await Course.findByIdAndUpdate(courseId, {
            $inc: { studentsCount: 1 },
          });
          await User.findByIdAndUpdate(
            userId,
            { role: "student" },
            { new: true }
          );
          console.log("Transaction + Enrollment saved for user : ", userId);
        } else {
          console.log("Enrollment already exists");
        }
      } else {
        console.log("Transaction already exists");
      }
    } catch (err) {
      console.error("Webhook processing error:", err.message);
    }
  } else if (event.type === "payment_intent.succeeded") {
    const intent = event.data.object;
    const { userId, courseId } = intent.metadata;

    try {
      const alreadyExists = await Transaction.findOne({
        paymentIntentId: intent.id,
      });
      if (!alreadyExists) {
        const course = await Course.findById(courseId);

        await Transaction.create({
          userId,
          courseId,
          paymentIntentId: intent.id,
          amount: course.price,
          paymentMethod: intent.payment_method_types[0] || "card",
        });

        const existing = await Enrollment.findOne({ userId, courseId });
        if (!existing) {
          await Enrollment.create({ userId, courseId });
          await Course.findByIdAndUpdate(courseId, {
            $inc: { studentsCount: 1 },
          });
          await User.findByIdAndUpdate(
            userId,
            { role: "student" },
            { new: true }
          );
          console.log(
            "Transaction + Enrollment saved (Elements) for user:",
            userId
          );
        } else {
          console.log("Enrollment already exists (Elements)");
        }
      } else {
        console.log("Transaction already exists (Elements)");
      }
    } catch (err) {
      console.error("Webhook Elements error:", err.message);
    }
  }
  // else {
  //   console.log(`Unhandled event type: ${event.type}`);
  // }

  res.status(200).send();
};

module.exports = router;
module.exports.handleWebhook = handleWebhook;
