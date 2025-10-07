"use client";

import { useState } from "react";
import { deriveKey, exportKeyB64 } from "../utils/crypto";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setMsg("Processing...");
    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (res.ok) {
        localStorage.setItem("token", data.token);

        try {
          const key = await deriveKey(password, data.vaultSalt);
          const keyB64 = await exportKeyB64(key);
          localStorage.setItem("vaultKey", keyB64);
        } catch {}
        setMsg("Login successful!");
        setTimeout(() => (window.location.href = "/vault"), 500);
      } else {
        setMsg(data.error || "Login failed.");
      }
    } catch {
      setMsg("Network error.");
    }
  };

  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white">
      <h1 className="text-3xl mb-6 font-semibold">Log In</h1>
      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-4 bg-gray-800 p-8 rounded-lg w-80"
      >
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
        <button
          type="submit"
          className="bg-blue-500 hover:bg-blue-600 py-2 rounded text-white font-semibold"
        >
          Log In
        </button>
        <p className="text-sm text-gray-400 text-center">{msg}</p>
        <a href="/signup" className="text-blue-400 text-sm text-center">
          New user? Sign up
        </a>
      </form>
    </main>
  );
}
