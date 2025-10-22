import React from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Auth.css";
import { useUser } from "../../context/UserContext";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../firebase";
import { useMutation } from "@tanstack/react-query";
import API from "../../api/axiosInstance";
import toast from "react-hot-toast";
import LoadingSpinner from "../../components/LoadingSpinner/LoadingSpinner";
import { useForm } from "react-hook-form";

import {
  GoogleAuthProvider,
  signInWithPopup,
  FacebookAuthProvider,
} from "firebase/auth";
import googleIcon from "../../assets/google-icon.png";

const SignIn: React.FC = () => {
  const { setUser } = useUser();
  const navigate = useNavigate();

  interface signInProps {
    email: string;
    password: string;
  }
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<signInProps>({
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const signInMutation = useMutation({
    mutationFn: async (data: signInProps) => {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        data.email,
        data.password
      );

      const firebaseUser = userCredential.user;

      const idToken = await firebaseUser.getIdToken();
      console.log("ID Token:", idToken);
      const { data: res } = await API.post("/auth/firebase-login", {
        idToken,
        providerId: "password",
      });
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
      const firebaseUser = result.user;
      const providerId = result.providerId || "google.com";

      const idToken = await firebaseUser.getIdToken();

      const { data: res } = await API.post("/auth/firebase-login", {
        idToken,
        providerId,
      });

      setUser({
        uid: res.uid,
        name: res.name,
        email: res.email,
        role: res.role,
        token: idToken,
      });

      toast.success("Signed in with Google!");
      navigate(res.role === "admin" ? "/admin" : "/");
    } catch (err: any) {
      console.error("Google sign-in error:", err);
      toast.error(err.response?.data?.message || "Google sign-in failed.");
    }
  };

  const handleFacebookSignIn = async () => {
    const provider = new FacebookAuthProvider();

    try {
      const result = await signInWithPopup(auth, provider);
      const firebaseUser = result.user;
      const providerId = result.providerId || "facebook.com";

      const idToken = await firebaseUser.getIdToken();

      const { data: res } = await API.post("/auth/firebase-login", {
        idToken,
        providerId,
      });

      setUser({
        uid: res.uid,
        name: res.name,
        email: res.email,
        role: res.role,
        token: idToken,
      });

      toast.success("Signed in with Facebook!");
      navigate(res.role === "admin" ? "/admin" : "/");
    } catch (err: any) {
      console.error("Facebook sign-in error:", err);
      toast.error(err.response?.data?.message || "Facebook sign-in failed.");
    }
  };

  const onSubmit = async (data: signInProps) => {
    signInMutation.mutate(data);
  };

  return (
    <div className="wrapper">
      <div className="auth-container">
        <h1>Sign In</h1>
        <form onSubmit={handleSubmit(onSubmit)} className="auth-form">
          <label>
            Email:
            <input
              type="email"
              {...register("email", { required: "Email is required" })}
              disabled={signInMutation.isPending}
            />
            {errors.email && (
              <p className="error-message">{errors.email.message}</p>
            )}
          </label>
          <label>
            Password:
            <input
              type="password"
              {...register("password", { required: "Password is required" })}
              disabled={signInMutation.isPending}
            />
            {errors.password && (
              <p className="error-message">{errors.password.message}</p>
            )}
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
          <button
            onClick={handleFacebookSignIn}
            type="button"
            className="facebook-btn"
          >
            <img
              src="https://www.facebook.com/images/fb_icon_325x325.png"
              alt="Facebook"
            />
            Sign in with Facebook
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
