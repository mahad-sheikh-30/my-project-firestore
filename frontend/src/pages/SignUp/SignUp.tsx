import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../SignIn/Auth.css";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../firebase";
import API from "../../api/axiosInstance";

const SignUp: React.FC = () => {
  const [data, setData] = useState({
    name: "",
    phone: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        data.email,
        data.password
      );
      const firebaseUser = userCredential.user;

      await API.post("/users", {
        name: data.name,
        phone: data.phone,
        email: firebaseUser.email,
        uid: firebaseUser.uid,
      });

      navigate("/signin");
    } catch (err: any) {
      setError(err.message);
    }
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
          <button type="submit">Sign Up</button>
          <p>
            Already have an account? <Link to="/signin">Sign In</Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default SignUp;
