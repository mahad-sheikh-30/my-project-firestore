import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Auth.css";
import { useUser } from "../../context/UserContext";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../firebase";
import { useMutation } from "@tanstack/react-query";
import API from "../../api/axiosInstance";
import toast from "react-hot-toast";
import LoadingSpinner from "../../components/LoadingSpinner/LoadingSpinner";
import {
  GoogleAuthProvider,
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult,
} from "firebase/auth";
import googleIcon from "../../assets/google-icon.png";

const SignIn: React.FC = () => {
  const [data, setData] = useState({ email: "", password: "" });

  const { setUser } = useUser();
  const navigate = useNavigate();

  const signInMutation = useMutation({
    mutationFn: async () => {
      if (!data.email || !data.password)
        throw new Error("Email and password are required.");

      const userCredential = await signInWithEmailAndPassword(
        auth,
        data.email,
        data.password
      );

      const firebaseUser = userCredential.user;

      const idToken = await firebaseUser.getIdToken();
      console.log("ID Token:", idToken);
      const { data: res } = await API.post("/auth/firebase-login", { idToken });
      return { firebaseUser, res, idToken };
    },
    onSuccess: ({ res, idToken }) => {
      setUser({
        uid: res.uid,
        name: res.name,
        email: res.email,
        role: res.role,
        token: idToken,
      });
      console.log(res.message);
      toast.success("Signed in successfully!");
      navigate(res.role === "admin" ? "/admin" : "/");
    },
    onError: (err: any) => {
      let message = "Something went wrong.";
      if (err.code === "auth/user-not-found") {
        message = "User not found. Please sign up first.";
      } else if (err.code === "auth/wrong-password") {
        message = "Incorrect password. Try again.";
      } else if (err.code === "auth/invalid-email") {
        message = "Invalid email address.";
      } else if (err.code === "auth/invalid-credential") {
        message = "Invalid credentials. Please check your email and password.";
      }
      toast.error(message);
    },
  });

  const handleGoogleSignIn = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      console.log("Google sign-in result:", result);
      const firebaseUser = result.user;
      const idToken = await firebaseUser.getIdToken();
      console.log("Google user:", firebaseUser);
      console.log("Google ID Token:", idToken);

      const { data: res } = await API.post("/auth/firebase-login", { idToken });

      setUser({
        uid: res.uid,
        name: res.name,
        email: res.email,
        role: res.role,
        token: idToken,
      });
      toast.success("Signed in with Google!");
      console.log(res.message);
      navigate(res.role === "admin" ? "/admin" : "/");
    } catch (err: any) {
      console.error("Google sign-in error:", err);
      toast.error("Google sign-in failed. Please try again.");
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    signInMutation.mutate();
  };

  return (
    <div className="wrapper">
      <div className="auth-container">
        <h1>Sign In</h1>
        <form onSubmit={handleSubmit} className="auth-form">
          <label>
            Email:
            <input
              type="email"
              name="email"
              value={data.email}
              onChange={handleChange}
              required
              disabled={signInMutation.isPending}
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
              disabled={signInMutation.isPending}
            />
          </label>

          <button
            type="submit"
            disabled={signInMutation.isPending}
            className="sign"
          >
            {signInMutation.isPending ? <LoadingSpinner /> : "Sign In"}
          </button>
          <button
            onClick={handleGoogleSignIn}
            type="button"
            className="google-btn"
          >
            <img src={googleIcon} alt="Google" />
            Sign in with Google
          </button>
          <p>
            Don’t have an account?
            {signInMutation.isPending ? (
              <></>
            ) : (
              <Link to="/signup">Sign Up</Link>
            )}
          </p>
        </form>
      </div>
    </div>
  );
};

export default SignIn;
