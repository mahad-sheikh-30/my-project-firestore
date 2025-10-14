require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connection = require("./db");
const bodyParser = require("body-parser");

const userRoutes = require("./routes/users");
const authRoutes = require("./routes/auth");
const contactRoutes = require("./routes/contact");
const teacherRoutes = require("./routes/teachers");
const courseRoutes = require("./routes/courses");
const enrollmentRoutes = require("./routes/enrollments");
const paymentRoutes = require("./routes/payment");
const transactionRoutes = require("./routes/transactions");
const { handleWebhook } = require("./routes/payment");

const app = express();
connection();

app.post(
  "/api/payment/webhook",
  bodyParser.raw({ type: "application/json" }),
  handleWebhook
);

app.use(cors());
app.use(express.json());

app.use("/api/users", userRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api/teachers", teacherRoutes);
app.use("/api/courses", courseRoutes);
app.use("/api/enrollments", enrollmentRoutes);
app.use("/api/payment", paymentRoutes);
app.use("/api/transactions", transactionRoutes);

const port = process.env.PORT || 8080;
app.listen(port, () => console.log(`✅ Listening on port ${port}...`));
