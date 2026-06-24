import React, { useState } from "react";
import {  Link, useNavigate } from "react-router";
import { useAuth } from "../hooks/auth.hooks";
export default function Register() {
    const {loading, handleRegister} = useAuth();
   
     const [email, setEmail] = useState("");
     const [password, setPassword] = useState("");
     const [username, setUsername] = useState("");
     const Navigate = useNavigate();
  const handleSubmit = async(e) => {
    e.preventDefault();
    await handleRegister({
        username,
        email,
        password
    });

    Navigate("/login");

  };
  return (
    <main>
      <div className="form-container">
        <h2>Register</h2>

        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label htmlFor="email">Username</label>
            <input
              onChange={(e) => {
                setUsername(e.target.value);
              }}
              type="username"
              id="username"
              name="username"
              placeholder="Enter your Username"
              required
            />
          </div>

          <div className="input-group">
            <label htmlFor="email">Email</label>
            <input
              onChange={(e) => {
                setEmail(e.target.value);
              }}
              type="email"
              id="email"
              name="email"
              placeholder="Enter your email"
              required
            />
          </div>

          <div className="input-group">
            <label htmlFor="password">Password</label>
            <input
              onChange={(e) => {
                setPassword(e.target.value);
              }}
              type="password"
              name="password"
              id="password"
              placeholder="Enter your Password"
            />
          </div>
          <button className="button primary-button" type="submit">
            Register
          </button>
        </form>
        <p>
          Already have an account ? <Link to={"/login"}>Login</Link>
        </p>
      </div>
    </main>
  );
}
