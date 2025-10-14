import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Auth.css";
import { useUser } from "../../context/UserContext";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../firebase";
import API from "../../api/axiosInstance";

const SignIn: React.FC = () => {
  const [data, setData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const { setUser } = useUser();
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        data.email,
        data.password
      );
      const firebaseUser = userCredential.user;

      const idToken = await firebaseUser.getIdToken();

      const { data: res } = await API.post("/auth/firebase-login", { idToken });

      setUser({
        uid: res.uid,
        name: res.name,
        email: res.email,
        role: res.role,
        token: idToken,
      });

      if (res.role === "admin") navigate("/admin");
      else navigate("/");
    } catch (err: any) {
      if (err.code === "auth/user-not-found") {
        setError("User not found. Please sign up first.");
      } else if (err.code === "auth/wrong-password") {
        setError("Incorrect password. Try again.");
      } else {
        setError(err.message);
      }
    }
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
            />
          </label>
          {error && <div className="error-message">{error}</div>}
          <button type="submit">Sign In</button>
          <p>
            Don’t have an account? <Link to="/signup">Sign Up</Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default SignIn;
