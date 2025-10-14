import React, { useEffect, useState } from "react";
import "./Payment.css";
import { useUser } from "../../context/UserContext";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  useStripe,
  useElements,
  CardNumberElement,
  CardExpiryElement,
  CardCvcElement,
} from "@stripe/react-stripe-js";

import API from "../../api/axiosInstance";
import { useLocation, useNavigate } from "react-router-dom";
import CourseCard from "../../components/CourseCard/CourseCard";
import type { Course } from "../../components/CourseCard/CourseCard";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createEnrollment } from "../../api/enrollmentApi";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY!);

const CheckoutForm: React.FC<{ clientSecret: string; course: Course }> = ({
  clientSecret,
  course,
}) => {
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { updateRole } = useUser();
  const queryClient = useQueryClient();

  const enrollMutation = useMutation({
    mutationFn: (courseId: string) => createEnrollment({ courseId }),
    onSuccess: (_, courseId) => {
      queryClient.setQueryData<string[]>(["enrolled"], (old = []) => [
        ...old,
        courseId,
      ]);
      queryClient.invalidateQueries({ queryKey: ["enrolled"] });
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stripe || !elements) return;
    setLoading(true);

    const cardElement = elements.getElement(CardNumberElement);
    if (!cardElement) return;

    const { error, paymentIntent } = await stripe.confirmCardPayment(
      clientSecret,
      { payment_method: { card: cardElement } }
    );

    if (error) {
      setError(error.message || "Payment failed");
      setLoading(false);
      return;
    }

    if (paymentIntent?.status === "succeeded") {
      try {
        await enrollMutation.mutateAsync(course.id);
        alert("Payment successful! You’re now enrolled in the course.");
        updateRole("student");
        navigate("/courses");
      } catch (err) {
        console.error("Enrollment after payment failed:", err);
        alert("Payment done, but enrollment failed. Please refresh.");
      }
    }

    setLoading(false);
  };

  const elementStyle = {
    base: {
      fontSize: "16px",
      color: "darkblue",
      "::placeholder": { color: "#a0aec0" },
    },
    invalid: { color: "red" },
  };

  return (
    <form onSubmit={handleSubmit} className="payment-form">
      <h3 className="checkout-heading">Enter Payment Details</h3>

      <label className="field-label">Card Number</label>
      <div className="input-box">
        <CardNumberElement options={{ style: elementStyle }} />
      </div>

      <div className="row">
        <div className="col">
          <label className="field-label">Expiry</label>
          <div className="input-box">
            <CardExpiryElement options={{ style: elementStyle }} />
          </div>
        </div>

        <div className="col">
          <label className="field-label">CVC</label>
          <div className="input-box">
            <CardCvcElement options={{ style: elementStyle }} />
          </div>
        </div>
      </div>

      <button type="submit" className="pay-btn" disabled={loading}>
        {loading ? "Processing..." : `Pay $${course.price}`}
      </button>

      {error && <p className="error">{error}</p>}
    </form>
  );
};

const PaymentPage: React.FC = () => {
  const [clientSecret, setClientSecret] = useState("");
  const location = useLocation();
  const course = location.state?.course as Course;
  const navigate = useNavigate();

  useEffect(() => {
    if (!course?.id) return;
    API.post("/payment/create-payment-intent", { courseId: course.id })
      .then((res) => setClientSecret(res.data.clientSecret))
      .catch((err) => {
        console.error(err);
        navigate("/");
      });
  }, [course, navigate]);

  if (!course) return <p>No course selected.</p>;
  if (!clientSecret) return <p>Loading payment details...</p>;

  return (
    <div className="payment-page">
      <div className="payment-left">
        <CourseCard course={course} checkout={true} />
      </div>

      <div className="payment-right">
        <Elements stripe={stripePromise}>
          <CheckoutForm clientSecret={clientSecret} course={course} />
        </Elements>
      </div>
    </div>
  );
};

export default PaymentPage;
