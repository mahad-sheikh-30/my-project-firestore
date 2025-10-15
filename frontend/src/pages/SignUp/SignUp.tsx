import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../SignIn/Auth.css";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../firebase";
import API from "../../api/axiosInstance";
import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";
import LoadingSpinner from "../../components/LoadingSpinner/LoadingSpinner";

const SignUp: React.FC = () => {
  const [data, setData] = useState({
    name: "",
    phone: "",
    email: "",
    password: "",
  });

  const navigate = useNavigate();

  const signUpMutation = useMutation({
    mutationFn: async () => {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        data.email,
        data.password
      );
      const firebaseUser = userCredential.user;
      console.log("user credentials:", userCredential);
      console.log("Firebase user :", firebaseUser);

      await API.post("/users", {
        name: data.name,
        phone: data.phone,
        email: firebaseUser.email,
        uid: firebaseUser.uid,
      });
      return firebaseUser;
    },
    onSuccess: () => {
      toast.success("Account created successfully!");
      navigate("/signin");
    },
    onError: (err: any) => {
      let message = err.message || "Something went wrong.";
      if (err.code === "auth/email-already-in-use")
        message = "Email is already registered.";
      if (err.code === "auth/invalid-email") message = "Invalid email address.";
      if (err.code === "auth/weak-password")
        message = "Password should be at least 6 characters.";
      toast.error(message);
    },
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    signUpMutation.mutate();
  };

  return (
    <div className="wrapper">
      <div className="auth-container">
        <h1>Sign Up</h1>
        <form onSubmit={handleSubmit} className="auth-form">
          <label>
            Name:
            <input
              type="text"
              name="name"
              value={data.name}
              onChange={handleChange}
              required
              disabled={signUpMutation.isPending}
            />
          </label>
          <label>
            Phone:
            <input
              type="tel"
              name="phone"
              value={data.phone}
              onChange={handleChange}
              required
              disabled={signUpMutation.isPending}
            />
          </label>
          <label>
            Email:
            <input
              type="email"
              name="email"
              value={data.email}
              onChange={handleChange}
              required
              disabled={signUpMutation.isPending}
            />
          </label>
          <label>
            Password:
            <input
              type="password"
              name="password"
              value={data.password}
              onChange={handleChange}
              required
              disabled={signUpMutation.isPending}
            />
          </label>

          <button
            type="submit"
            disabled={signUpMutation.isPending}
            className="sign"
          >
            {signUpMutation.isPending ? <LoadingSpinner /> : "Sign Up"}
          </button>

          <p>
            Don’t have an account?
            {signUpMutation.isPending ? (
              <></>
            ) : (
              <Link to="/signin">Sign In</Link>
            )}
          </p>
        </form>
      </div>
    </div>
  );
};

export default SignUp;
