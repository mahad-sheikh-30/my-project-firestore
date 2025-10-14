import React, { useReducer, useState } from "react";
import axios from "axios";
import "./Contact.css";
import API from "../../api/axiosInstance";
const Contact: React.FC = () => {
  interface formState {
    name: string;
    phone: string;
    email: string;
    comments: string;
    submitted: Boolean;
  }

  const initialState: formState = {
    name: "",
    phone: "",
    email: "",
    comments: "",
    submitted: false,
  };

  type formAction =
    | { type: "SET_NAME"; payload: string }
    | { type: "SET_PHONE"; payload: string }
    | { type: "SET_EMAIL"; payload: string }
    | { type: "SET_COMMENT"; payload: string }
    | { type: "SUBMIT" }
    | { type: "RESET" };

  const formReducer = (state: formState, action: formAction) => {
    switch (action.type) {
      case "SET_NAME":
        return { ...state, name: action.payload };
      case "SET_PHONE":
        return { ...state, phone: action.payload };
      case "SET_EMAIL":
        return { ...state, email: action.payload };
      case "SET_COMMENT":
        return { ...state, comments: action.payload };
      case "SUBMIT":
        return { ...state, submitted: true };
      case "RESET":
        return initialState;
      default:
        return state;
    }
  };
  const [state, dispatch] = useReducer(formReducer, initialState);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    dispatch({ type: "SUBMIT" });

    try {
      const res = await API.post("/contact", state);
      alert("Form submitted successfully!");
      console.log("Response:", res.data);

      dispatch({ type: "RESET" });
    } catch (err: any) {
      if (err.response) {
        alert(err.response.data.message || "Failed to submit form");
        console.error("Error:", err.response.data);
      } else if (err.request) {
        alert("No response from server. Please check backend.");
      } else {
        alert("Error: " + err.message);
      }
    }
  };

  const handleNameChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    dispatch({ type: "SET_NAME", payload: e.target.value });
  };
  const handlePhoneChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    dispatch({ type: "SET_PHONE", payload: e.target.value });
  };
  const handleEmailChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    dispatch({ type: "SET_EMAIL", payload: e.target.value });
  };
  const handleCommentChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    dispatch({ type: "SET_COMMENT", payload: e.target.value });
  };

  return (
    <div className="contact-container">
      <h1>Contact Us</h1>
      <form onSubmit={handleSubmit} className="contact-form">
        <label>
          Name:
          <input
            type="text"
            id="name"
            name="name"
            value={state.name}
            onChange={handleNameChange}
            required
          />
        </label>
        <label>
          Phone:
          <input
            type="tel"
            id="phone"
            name="phone"
            value={state.phone}
            onChange={handlePhoneChange}
            required
          />
        </label>
        <label>
          Email:
          <input
            type="email"
            id="email"
            name="email"
            value={state.email}
            onChange={handleEmailChange}
            required
          />
        </label>

        <label>
          Comments:
          <textarea
            id="comments"
            name="comments"
            value={state.comments}
            onChange={handleCommentChange}
          ></textarea>
        </label>
        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default Contact;
