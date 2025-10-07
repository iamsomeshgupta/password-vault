"use client";

import { useEffect, useState } from "react";

export default function Navbar() {
  const [authed, setAuthed] = useState(false);

  useEffect(() => {
    setAuthed(!!localStorage.getItem("token"));
  }, []);

  function logout() {
    localStorage.removeItem("token");
    window.location.href = "/";
  }

  return (
    <nav className="w-full bg-gray-900 text-white border-b border-gray-800">
      <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
        <a href="/" className="font-semibold">Password Vault</a>
        <div className="flex items-center gap-3">
          {authed ? (
            <>
              <a href="/vault" className="px-3 py-1 rounded bg-gray-800 hover:bg-gray-700">Vault</a>
              <button onClick={logout} className="px-3 py-1 rounded bg-red-600 hover:bg-red-700">Logout</button>
            </>
          ) : (
            <>
              <a href="/login" className="px-3 py-1 rounded bg-gray-800 hover:bg-gray-700">Login</a>
              <a href="/signup" className="px-3 py-1 rounded bg-blue-600 hover:bg-blue-700">Sign Up</a>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}


