"use client";

import { useState } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useRouter } from "next/navigation";
import { FaEye, FaEyeSlash, FaLock, FaEnvelope } from "react-icons/fa";

export default function ChangePasswordPage() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const router = useRouter();

  const validateForm = () => {
    if (!email || !currentPassword || !newPassword || !confirmPassword) {
      setError("Please fill in all fields");
      return false;
    }
    if (newPassword.length < 6) {
      setError("New password must be at least 6 characters");
      return false;
    }
    if (newPassword !== confirmPassword) {
      setError("New passwords do not match");
      return false;
    }
    return true;
  };

  const submit = async (e) => {
    e.preventDefault();
    setError("");

    if (!validateForm()) {
      toast.error(error);
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/change-password", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, currentPassword, newPassword }),
      });
      const data = await res.json();
      if (res.ok) {
        toast.success(data.message || "Password changed successfully");
        setTimeout(() => router.push("/login"), 1500);
      } else {
        setError(data.message || "Failed to change password");
        toast.error(data.message || "Failed to change password");
      }
    } catch (err) {
      console.error(err);
      const errorMsg = err.message || "Server error";
      setError(errorMsg);
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="w-full min-h-screen flex flex-col items-center justify-center px-3 py-6"
      style={{ background: "var(--bg)" }}
    >
      <div className="w-full max-w-sm card rounded-lg shadow-lg border p-6">
        <div className="text-center mb-6">
          <div className="flex justify-center mb-3">
            <FaLock className="text-3xl" style={{ color: "var(--primary)" }} />
          </div>
          <h1
            className="text-2xl sm:text-3xl font-bold"
            style={{ color: "var(--primary)" }}
          >
            Change Password
          </h1>
          <p style={{ color: "var(--fg-secondary)" }} className="text-xs mt-2">
            Update your password to keep your account secure
          </p>
        </div>
        <form onSubmit={submit} className="space-y-4">
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
                value={email}
                className="input-card text-xs px-3 py-3 outline-none grow bg-transparent border-0"
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                required
              />
            </div>
          </div>

          <div>
            <label
              className="block text-xs font-medium mb-2"
              style={{ color: "var(--fg-secondary)" }}
            >
              Current Password
            </label>
            <div className="flex items-center input-card border rounded px-3">
              <FaLock className="text-sm" style={{ color: "var(--primary)" }} />
              <input
                type={showCurrentPassword ? "text" : "password"}
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="input-card text-xs px-3 py-3 outline-none grow bg-transparent border-0"
                placeholder="Enter current password"
                required
              />
              <button
                type="button"
                onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                className="px-2 text-fg cursor-pointer hover:opacity-70 transition"
              >
                {showCurrentPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </div>

          <div>
            <label
              className="block text-xs font-medium mb-2"
              style={{ color: "var(--fg-secondary)" }}
            >
              New Password
            </label>
            <div className="flex items-center input-card border rounded px-3">
              <FaLock className="text-sm" style={{ color: "var(--primary)" }} />
              <input
                type={showNewPassword ? "text" : "password"}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="input-card text-xs px-3 py-3 outline-none grow bg-transparent border-0"
                placeholder="Enter new password"
                required
              />
              <button
                type="button"
                onClick={() => setShowNewPassword(!showNewPassword)}
                className="px-2 text-fg cursor-pointer hover:opacity-70 transition"
              >
                {showNewPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </div>

          <div>
            <label
              className="block text-xs font-medium mb-2"
              style={{ color: "var(--fg-secondary)" }}
            >
              Confirm New Password
            </label>
            <div className="flex items-center input-card border rounded px-3">
              <FaLock className="text-sm" style={{ color: "var(--primary)" }} />
              <input
                type={showConfirmPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="input-card text-xs px-3 py-3 outline-none grow bg-transparent border-0"
                placeholder="Confirm new password"
                required
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

          <div>
            <button
              type="submit"
              disabled={loading}
              className="w-full px-3 py-3 btn-primary rounded text-sm font-semibold mt-2 disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
              {loading ? "Updating..." : "Change Password"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
