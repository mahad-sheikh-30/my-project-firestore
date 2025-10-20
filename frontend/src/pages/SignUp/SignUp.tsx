import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../SignIn/Auth.css";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../firebase";
import API from "../../api/axiosInstance";
import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";
import LoadingSpinner from "../../components/LoadingSpinner/LoadingSpinner";
import { useForm } from "react-hook-form";

const SignUp: React.FC = () => {
  interface signUpProps {
    name: string;
    phone: string;
    email: string;
    password: string;
  }
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<signUpProps>({
    defaultValues: {
      name: "",
      phone: "",
      email: "",
      password: "",
    },
  });
  // const [data, setData] = useState({
  //   name: "",
  //   phone: "",
  //   email: "",
  //   password: "",
  // });

  const navigate = useNavigate();

  const signUpMutation = useMutation({
    mutationFn: async (data: signUpProps) => {
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

  const onSubmit = async (data: signUpProps) => {
    signUpMutation.mutate(data);
  };

  return (
    <div className="wrapper">
      <div className="auth-container">
        <h1>Sign Up</h1>
        <form onSubmit={handleSubmit(onSubmit)} className="auth-form">
          <label>
            Name:
            <input
              type="text"
              {...register("name", { required: "Name is required" })}
              disabled={signUpMutation.isPending}
            />
            {errors.name && (
              <p className="error-message">{errors.name.message}</p>
            )}
          </label>
          <label>
            Phone:
            <input
              type="tel"
              {...register("phone", { required: "Phone is required" })}
              disabled={signUpMutation.isPending}
            />
            {errors.phone && (
              <p className="error-message">{errors.phone.message}</p>
            )}
          </label>
          <label>
            Email:
            <input
              type="email"
              {...register("email", { required: "Email is required" })}
              disabled={signUpMutation.isPending}
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
              disabled={signUpMutation.isPending}
            />
            {errors.password && (
              <p className="error-message">{errors.password.message}</p>
            )}
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
