import React, { useState } from "react";
import { register } from "../../../utils/auth_utils";
import './register.css';

function Register() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await register(username, password, email);
    if (result.success) {
      setMessage(result.message);
      setError("");
    } else {
      setError(result.error);
      setMessage("");
    }
  };

  return (
    <div className="page-container register-page">
      <h2 className="register-title">Register</h2>
      <form onSubmit={handleSubmit} className="register-form">
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <button type="submit">Register</button>
      </form>
      {error && <p className="register-error">{error}</p>}
      {message && <p className="register-success">{message}</p>}
    </div>
  );
}

export default Register;
