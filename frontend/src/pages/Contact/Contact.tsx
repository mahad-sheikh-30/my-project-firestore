import React, { useReducer } from "react";
import "./Contact.css";
import API from "../../api/axiosInstance";
import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";
import LoadingSpinner from "../../components/LoadingSpinner/LoadingSpinner";

const Contact: React.FC = () => {
  interface formState {
    name: string;
    phone: string;
    email: string;
    comments: string;
    submitted: boolean;
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

  const formReducer = (state: formState, action: formAction): formState => {
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

  // 🧩 Define the mutation
  const contactMutation = useMutation({
    mutationFn: async () => {
      return await API.post("/contact", {
        name: state.name,
        phone: state.phone,
        email: state.email,
        comments: state.comments,
      });
    },
    onSuccess: () => {
      toast.success("Form submitted successfully!");
      dispatch({ type: "RESET" });
    },
    onError: (err: any) => {
      const message =
        err.response?.data?.message || err.request
          ? "No response from server. Please check backend."
          : err.message || "Failed to submit form";
      toast.error(message);
    },
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    dispatch({ type: "SUBMIT" });
    contactMutation.mutate();
  };

  return (
    <div className="contact-container">
      <h1>Contact Us</h1>

      <form onSubmit={handleSubmit} className="contact-form">
        <label>
          Name:
          <input
            type="text"
            name="name"
            value={state.name}
            onChange={(e) =>
              dispatch({ type: "SET_NAME", payload: e.target.value })
            }
            required
            disabled={contactMutation.isPending}
          />
        </label>

        <label>
          Phone:
          <input
            type="tel"
            name="phone"
            value={state.phone}
            onChange={(e) =>
              dispatch({ type: "SET_PHONE", payload: e.target.value })
            }
            required
            disabled={contactMutation.isPending}
          />
        </label>

        <label>
          Email:
          <input
            type="email"
            name="email"
            value={state.email}
            onChange={(e) =>
              dispatch({ type: "SET_EMAIL", payload: e.target.value })
            }
            required
            disabled={contactMutation.isPending}
          />
        </label>

        <label>
          Comments:
          <textarea
            name="comments"
            value={state.comments}
            onChange={(e) =>
              dispatch({ type: "SET_COMMENT", payload: e.target.value })
            }
            disabled={contactMutation.isPending}
          />
        </label>

        <button type="submit" disabled={contactMutation.isPending}>
          {contactMutation.isPending ? <LoadingSpinner /> : "Submit"}
        </button>
      </form>
    </div>
  );
};

export default Contact;
