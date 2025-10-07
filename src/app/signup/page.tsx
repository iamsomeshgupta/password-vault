"use client";

import { useState } from "react";

export default function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");

  async function signup(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setMsg("Processing...");
    try {
      const res = await fetch("/api/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (res.ok) {
        setMsg("Signup successful. Please login.");
        setTimeout(() => (window.location.href = "/login"), 500);
      } else {
        setMsg(data.error || "Signup failed.");
      }
    } catch {
      setMsg("Network error.");
    }
  }

  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white">
      <h1 className="text-3xl mb-6 font-semibold">Sign Up</h1>
      <form onSubmit={signup} className="flex flex-col gap-4 bg-gray-800 p-8 rounded-lg w-80">
        <input
          type="email"
          placeholder="Email"
          className="p-2 rounded bg-gray-700 text-white"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          className="p-2 rounded bg-gray-700 text-white"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit" className="bg-blue-500 hover:bg-blue-600 py-2 rounded text-white font-semibold">
          Sign Up
        </button>
        <p className="text-sm text-gray-400 text-center">{msg}</p>
        <a href="/login" className="text-blue-400 text-sm text-center">
          Have an account? Log in
        </a>
      </form>
    </main>
  );
}


