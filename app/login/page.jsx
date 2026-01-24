"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaEye, FaEyeSlash, FaLock, FaEnvelope } from "react-icons/fa";

export default function LoginPage() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!form.email || !form.password) {
      setError("Please fill in all fields");
      toast.error("Please fill in all fields");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Something went wrong");

      toast.success("Login successful");
      router.push("/");
    } catch (err) {
      console.error(err);
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
      {/* Login form */}
      <div className="w-full max-w-sm card rounded-lg shadow-lg border p-6">
        <div className="text-center mb-6">
          <div className="flex justify-center mb-3">
            <FaLock className="text-3xl" style={{ color: "var(--primary)" }} />
          </div>
          <h1
            className="text-2xl sm:text-3xl font-bold"
            style={{ color: "var(--primary)" }}
          >
            Login
          </h1>
          <p style={{ color: "var(--fg-secondary)" }} className="text-xs mt-2">
            Welcome back! Please login to your account
          </p>
        </div>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
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
            <div className="flex items-center justify-between mb-2">
              <label
                className="block text-xs font-medium"
                style={{ color: "var(--fg-secondary)" }}
              >
                Password
              </label>
              <a
                href="#"
                className="text-xs hover:underline"
                style={{ color: "var(--primary)" }}
              >
                Forgot password?
              </a>
            </div>
            <div className="w-full input-card border flex items-center rounded px-3">
              <FaLock className="text-sm" style={{ color: "var(--primary)" }} />
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Enter your password"
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
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <p className="text-fg-secondary text-xs mt-4 text-center">
          New here?{" "}
          <a
            href="/register"
            className="text-primary hover:underline font-medium"
          >
            sign up
          </a>
        </p>
        <p className="text-fg-secondary text-xs mt-2 text-center">
          <a
            href="/change-password"
            className="text-primary hover:underline font-medium"
          >
            Change password
          </a>
        </p>
      </div>
    </div>
  );
}
