"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({ username: "", email: "", password: "" });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Something went wrong");

      toast.success("Registration successful! You can now log in.");
      router.push("/login");
    } catch (err) {
      setError(err.message);
      toast.error(err.message);
    }
  };

  return (
    <div
      className="relative min-h-screen w-full flex flex-col items-center justify-center px-3 py-6"
      style={{ background: "var(--bg)" }}
    >
      {/* Register form */}
      <div className="w-full max-w-sm card rounded-lg shadow-sm border p-4">
        <h1
          className="text-xl sm:text-2xl font-bold mb-4 text-center"
          style={{ color: "var(--primary)" }}
        >
          Register
        </h1>
        <form onSubmit={handleSubmit} className="flex flex-col gap-2">
          <input
            type="text"
            name="username"
            placeholder="Username"
            value={form.username}
            onChange={handleChange}
            required
            className="input-card border rounded text-xs p-2 outline-none"
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            required
            className="input-card border rounded text-xs p-2 outline-none"
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            required
            className="input-card border rounded text-xs p-2 outline-none"
          />
          <button
            type="submit"
            className="btn-primary transition py-2 rounded font-semibold text-xs mt-2"
          >
            Register
          </button>
          {error && (
            <p className="text-xs text-fg-secondary text-center">{error}</p>
          )}
        </form>

        <p className="text-fg-secondary text-xs mt-4 text-center">
          Already have an account?{" "}
          <Link
            href="/login"
            className="text-primary hover:underline font-medium"
          >
            Login here
          </Link>
        </p>
      </div>
    </div>
  );
}
