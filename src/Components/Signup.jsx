import { useState } from "react";
import "./Signup.css";

function Signup({ onSignup }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSignup = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    // Check passwords
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      const response = await fetch(
        "https://taskflow-uyil.onrender.com/api/signup",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            name: name,
            email: email,
            password: password,
          }),
        }
      );

      const data = await response.json();

      console.log("Signup response:", data);

      if (!response.ok) {
        setError(data.message);
        return;
      }

      setSuccess("Account created successfully!");

      // Clear form
      setName("");
      setEmail("");
      setPassword("");
      setConfirmPassword("");

      // Wait a little so user can see success message
      setTimeout(() => {
        onSignup();
      }, 1000);

    } catch (error) {
      console.error("Signup error:", error);

      setError(
        "Unable to connect to the server. Please try again."
      );
    }
  };

  return (
    <div className="signup-page">

      <div className="signup-card">

        {/* Logo */}
        <div className="signup-logo">
          <div className="logo-icon">✓</div>
          <h1>TaskFlow</h1>
        </div>

        {/* Heading */}
        <h2>Create your account</h2>

        <p className="signup-subtitle">
          Start organizing your tasks today.
        </p>

        <form onSubmit={handleSignup}>

          {/* Name */}
          <div className="form-group">
            <label>Name</label>

            <input
              type="text"
              value={name}
              onChange={(e) =>
                setName(e.target.value)
              }
              placeholder="Enter your name"
              required
            />
          </div>

          {/* Email */}
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

          {/* Password */}
          <div className="form-group">
            <label>Password</label>

            <input
              type="password"
              value={password}
              onChange={(e) =>
                setPassword(e.target.value)
              }
              placeholder="Create a password"
              required
            />
          </div>

          {/* Confirm Password */}
          <div className="form-group">
            <label>Confirm Password</label>

            <input
              type="password"
              value={confirmPassword}
              onChange={(e) =>
                setConfirmPassword(e.target.value)
              }
              placeholder="Confirm your password"
              required
            />
          </div>

          {/* Error */}
          {error && (
            <p className="signup-error">
              {error}
            </p>
          )}

          {/* Success */}
          {success && (
            <p className="signup-success">
              {success}
            </p>
          )}

          {/* Button */}
          <button
            type="submit"
            className="signup-button"
          >
            Create Account
          </button>

        </form>

        {/* Login */}
        <p className="login-link">
          Already have an account?{" "}

          <button
            type="button"
            onClick={onSignup}
          >
            Login
          </button>
        </p>

      </div>

    </div>
  );
}

export default Signup;