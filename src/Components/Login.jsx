import { useState } from "react";
import "./Login.css";

function Login({ onLogin,onSignup }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
const handleLogin = async (e) => {
  e.preventDefault();

  setError("");

  const response = await fetch(
    "https://taskflow-uyil.onrender.com/api/login",
    {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify({
        email: email,
        password: password,
      }),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    setError(data.message);
    return;
  }

  console.log("Login successful");

  localStorage.setItem("token", data.token);

  console.log("Token saved");

  onLogin();
};
  return (
    <div className="login-page">

      <div className="login-card">

        <div className="login-logo">
          <div className="logo-icon">✓</div>
          <h1>TaskFlow</h1>
        </div>

        <h2>Welcome back 👋</h2>

        <p className="login-subtitle">
          Login to manage your tasks and stay productive.
        </p>

        <form onSubmit={handleLogin}>

          <div className="form-group">
            <label>Email</label>

            <input
              type="email"
              value={email}
              onChange={(e) =>
                setEmail(e.target.value)
              }
              placeholder="Enter your email"
              required
            />
          </div>

          <div className="form-group">
            <label>Password</label>

            <input
              type="password"
              value={password}
              onChange={(e) =>
                setPassword(e.target.value)
              }
              placeholder="Enter your password"
              required
            />
          </div>
{error && (
  <p className="login-error">
    {error}
  </p>
)}

          <button
            type="submit"
            className="login-button"
          >
            Login
          </button>

        </form>

        <p className="signup-link">
          Don't have an account?{" "}
          <button type="button" onClick={onSignup}>
            Sign up
          </button>
        </p>

      </div>

    </div>
  );
}

export default Login;