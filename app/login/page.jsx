"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaEye, FaEyeSlash } from "react-icons/fa";
export default function LoginPage() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const router = useRouter();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };
  const [showPassword, setshowPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

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
      setError(err.message);
      toast.error(err.message);
    }
  };

  return (
    <div
      className="relative min-h-screen w-full flex flex-col items-center justify-center px-3 py-6"
      style={{ background: "var(--bg)" }}
    >
      {/* Login form */}
      <div className="w-full max-w-sm card rounded-lg shadow-sm border p-4">
        <h1
          className="text-xl sm:text-2xl font-bold mb-4 text-center"
          style={{ color: "var(--primary)" }}
        >
          Login
        </h1>
        <form onSubmit={handleSubmit} className="flex flex-col gap-2">
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            required
            className="input-card border rounded text-xs p-2 outline-none"
          />
          <div className="w-full input-card border flex items-center rounded">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Password"
              value={form.password}
              onChange={handleChange}
              required
              className="input-card text-xs px-2 py-2 rounded outline-none grow bg-transparent border-0"
            />
            <div
              className="px-2 text-fg cursor-pointer"
              onClick={() => setshowPassword(!showPassword)}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </div>
          </div>

          <button
            type="submit"
            className="btn-primary transition py-2 rounded font-semibold text-xs mt-2"
          >
            Login
          </button>
          {error && (
            <p className="text-xs text-fg-secondary text-center">{error}</p>
          )}
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
