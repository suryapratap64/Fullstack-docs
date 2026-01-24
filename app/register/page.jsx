"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaEye, FaEyeSlash, FaUser, FaEnvelope, FaLock } from "react-icons/fa";

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
  };

  const validateForm = () => {
    if (
      !form.username ||
      !form.email ||
      !form.password ||
      !form.confirmPassword
    ) {
      setError("Please fill in all fields");
      return false;
    }
    if (form.username.length < 3) {
      setError("Username must be at least 3 characters");
      return false;
    }
    if (form.password.length < 6) {
      setError("Password must be at least 6 characters");
      return false;
    }
    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!validateForm()) {
      toast.error(error);
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: form.username,
          email: form.email,
          password: form.password,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Something went wrong");

      toast.success("Registration successful! Redirecting to login...");
      setTimeout(() => router.push("/login"), 1500);
    } catch (err) {
      const errorMsg = err.message || "Something went wrong";
      setError(errorMsg);
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="relative min-h-screen w-full flex flex-col items-center justify-center px-3 py-6"
      style={{ background: "var(--bg)" }}
    >
      {/* Register form */}
      <div className="w-full max-w-sm card rounded-lg shadow-lg border p-6">
        <div className="text-center mb-6">
          <div className="flex justify-center mb-3">
            <FaUser className="text-3xl" style={{ color: "var(--primary)" }} />
          </div>
          <h1
            className="text-2xl sm:text-3xl font-bold"
            style={{ color: "var(--primary)" }}
          >
            Create Account
          </h1>
          <p style={{ color: "var(--fg-secondary)" }} className="text-xs mt-2">
            Join us to start your learning journey
          </p>
        </div>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label
              className="block text-xs font-medium mb-2"
              style={{ color: "var(--fg-secondary)" }}
            >
              Username
            </label>
            <div className="flex items-center input-card border rounded px-3">
              <FaUser className="text-sm" style={{ color: "var(--primary)" }} />
              <input
                type="text"
                name="username"
                placeholder="Choose a username"
                value={form.username}
                onChange={handleChange}
                required
                className="input-card text-xs px-3 py-3 outline-none grow bg-transparent border-0"
              />
            </div>
          </div>

          <div>
            <label
              className="block text-xs font-medium mb-2"
              style={{ color: "var(--fg-secondary)" }}
            >
              Email Address
            </label>
            <div className="flex items-center input-card border rounded px-3">
              <FaEnvelope
                className="text-sm"
                style={{ color: "var(--primary)" }}
              />
              <input
                type="email"
                name="email"
                placeholder="you@example.com"
                value={form.email}
                onChange={handleChange}
                required
                className="input-card text-xs px-3 py-3 outline-none grow bg-transparent border-0"
              />
            </div>
          </div>

          <div>
            <label
              className="block text-xs font-medium mb-2"
              style={{ color: "var(--fg-secondary)" }}
            >
              Password
            </label>
            <div className="flex items-center input-card border rounded px-3">
              <FaLock className="text-sm" style={{ color: "var(--primary)" }} />
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Create a strong password"
                value={form.password}
                onChange={handleChange}
                required
                className="input-card text-xs px-3 py-3 outline-none grow bg-transparent border-0"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="px-2 text-fg cursor-pointer hover:opacity-70 transition"
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </div>

          <div>
            <label
              className="block text-xs font-medium mb-2"
              style={{ color: "var(--fg-secondary)" }}
            >
              Confirm Password
            </label>
            <div className="flex items-center input-card border rounded px-3">
              <FaLock className="text-sm" style={{ color: "var(--primary)" }} />
              <input
                type={showConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                placeholder="Confirm your password"
                value={form.confirmPassword}
                onChange={handleChange}
                required
                className="input-card text-xs px-3 py-3 outline-none grow bg-transparent border-0"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="px-2 text-fg cursor-pointer hover:opacity-70 transition"
              >
                {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </div>

          {error && (
            <div className="p-3 rounded bg-red-500/10 border border-red-500/30">
              <p className="text-xs text-red-500 text-center">{error}</p>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="btn-primary transition py-3 rounded font-semibold text-sm mt-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Creating Account..." : "Create Account"}
          </button>
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
