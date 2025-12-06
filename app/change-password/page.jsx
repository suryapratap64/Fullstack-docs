"use client";

import { useState } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

export default function ChangePasswordPage() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const submit = async (e) => {
    e.preventDefault();
    if (!currentPassword || !newPassword)
      return toast.error("Please fill all fields");
    if (newPassword !== confirmPassword)
      return toast.error("Passwords do not match");
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
        toast.success(data.message || "Password changed");
        // Redirect to login page after password change
        setTimeout(() => router.push("/login"), 800);
      } else {
        toast.error(data.message || "Failed to change password");
      }
    } catch (err) {
      console.error(err);
      toast.error("Server error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="w-full min-h-screen flex flex-col items-center justify-center px-3 py-6"
      style={{ background: "var(--bg)" }}
    >
      <div className="w-full max-w-sm card rounded-lg shadow-sm border p-4">
        <h1
          className="text-xl sm:text-2xl font-bold mb-4 text-center"
          style={{ color: "var(--primary)" }}
        >
          Change Password
        </h1>
        <form onSubmit={submit} className="space-y-2">
          <div>
            <label className="block text-xs font-medium mb-1 text-fg-secondary">
              Email
            </label>
            <input
              type="email"
              value={email}
              className="w-full p-2 rounded border text-xs input-card outline-none"
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
            />
          </div>
          <div>
            <label className="block text-xs font-medium mb-1 text-fg-secondary">
              Current Password
            </label>
            <input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="w-full p-2 border rounded text-xs input-card outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-medium mb-1 text-fg-secondary">
              New Password
            </label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full p-2 border rounded text-xs input-card outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-medium mb-1 text-fg-secondary">
              Confirm Password
            </label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full p-2 border rounded text-xs input-card outline-none"
            />
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="w-full px-3 py-2 btn-primary rounded text-xs font-medium mt-2"
            >
              {loading ? "Saving..." : "Change Password"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
