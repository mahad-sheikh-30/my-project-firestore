import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./Auth.css";
import { useUser } from "../../context/UserContext";
import API from "../../api/axiosInstance";

const SignIn: React.FC = () => {
  const [data, setData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const { setUser } = useUser();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const { data: res } = await API.post("/auth", data);

      setUser({
        name: res.name,
        email: res.email,
        role: res.role,
        token: res.data,
      });

      if (res.role === "admin") {
        window.location.href = "/admin";
      } else {
        window.location.href = "/";
      }
      console.log(res.message);
    } catch (error: any) {
      if (
        error.response &&
        error.response.status >= 400 &&
        error.response.status <= 500
      ) {
        setError(error.response.data.message);
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
