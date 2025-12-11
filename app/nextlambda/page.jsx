"use client";
import { useState } from "react";
import toast from "react-hot-toast";

export default function LambdaTestPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);
  const [responseTime, setResponseTime] = useState(0);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name.trim()) {
      toast.error("Please enter a name");
      return;
    }

    setLoading(true);
    const startTime = Date.now();

    try {
      const res = await fetch(
        "https://oqys15qnmg.execute-api.us-east-1.amazonaws.com/default/handlenextform/handlenextform",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name, email, message }),
        }
      );

      const endTime = Date.now();
      setResponseTime(endTime - startTime);

      const data = await res.json();
      setResponse(JSON.stringify(data, null, 2));

      if (res.ok) {
        toast.success("Request successful!");
        setName("");
        setEmail("");
        setMessage("");
      } else {
        toast.error("Request failed");
      }
    } catch (error) {
      setResponseTime(Date.now() - startTime);
      setResponse(JSON.stringify({ error: error.message }, null, 2));
      toast.error("Error: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCopyResponse = () => {
    navigator.clipboard.writeText(response);
    toast.success("Response copied!");
  };

  const handleClear = () => {
    setName("");
    setEmail("");
    setMessage("");
    setResponse("");
    setResponseTime(0);
  };

  return (
    <div
      className="min-h-screen"
      style={{
        backgroundColor: "var(--bg)",
        color: "var(--fg)",
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold mb-2">⚡ Lambda Function Tester</h1>
          <p className="text-lg" style={{ color: "var(--fg-secondary)" }}>
            Test your AWS Lambda function with a beautiful UI
          </p>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column - Form */}
          <div
            className="rounded-lg border p-6"
            style={{
              backgroundColor: "var(--bg-secondary)",
              borderColor: "var(--border)",
            }}
          >
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
              📝 Request
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Name Input */}
              <div>
                <label
                  className="block text-sm font-semibold mb-2"
                  style={{ color: "var(--fg-secondary)" }}
                >
                  Name *
                </label>
                <input
                  type="text"
                  placeholder="Enter your name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 transition"
                  style={{
                    backgroundColor: "var(--bg)",
                    borderColor: "var(--border)",
                    color: "var(--fg)",
                  }}
                  onFocus={(e) =>
                    (e.target.style.borderColor = "var(--primary)")
                  }
                  onBlur={(e) => (e.target.style.borderColor = "var(--border)")}
                />
              </div>

              {/* Email Input */}
              <div>
                <label
                  className="block text-sm font-semibold mb-2"
                  style={{ color: "var(--fg-secondary)" }}
                >
                  Email (Optional)
                </label>
                <input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 transition"
                  style={{
                    backgroundColor: "var(--bg)",
                    borderColor: "var(--border)",
                    color: "var(--fg)",
                  }}
                  onFocus={(e) =>
                    (e.target.style.borderColor = "var(--primary)")
                  }
                  onBlur={(e) => (e.target.style.borderColor = "var(--border)")}
                />
              </div>

              {/* Message Input */}
              <div>
                <label
                  className="block text-sm font-semibold mb-2"
                  style={{ color: "var(--fg-secondary)" }}
                >
                  Message (Optional)
                </label>
                <textarea
                  placeholder="Enter your message"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  rows="4"
                  className="w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 transition resize-none"
                  style={{
                    backgroundColor: "var(--bg)",
                    borderColor: "var(--border)",
                    color: "var(--fg)",
                  }}
                  onFocus={(e) =>
                    (e.target.style.borderColor = "var(--primary)")
                  }
                  onBlur={(e) => (e.target.style.borderColor = "var(--border)")}
                />
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 px-6 py-3 rounded-lg font-semibold transition transform hover:scale-105 disabled:opacity-50"
                  style={{
                    backgroundColor: "var(--primary)",
                    color: "#000",
                  }}
                >
                  {loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <span className="inline-block animate-spin">⚙️</span>
                      Sending...
                    </span>
                  ) : (
                    "🚀 Send Request"
                  )}
                </button>
                <button
                  type="button"
                  onClick={handleClear}
                  className="px-6 py-3 rounded-lg font-semibold border transition"
                  style={{
                    borderColor: "var(--border)",
                    color: "var(--fg)",
                  }}
                >
                  🔄 Clear
                </button>
              </div>
            </form>

            {/* Request Info */}
            <div
              className="mt-6 p-4 rounded-lg text-sm"
              style={{
                backgroundColor: "var(--bg)",
                borderLeft: "4px solid var(--primary)",
              }}
            >
              <p
                className="font-semibold mb-1"
                style={{ color: "var(--primary)" }}
              >
                📌 Endpoint
              </p>
              <code
                className="text-xs break-all"
                style={{ color: "var(--fg-secondary)" }}
              >
                oqys15qnmg.execute-api.us-east-1.amazonaws.com/default/handlenextform
              </code>
            </div>
          </div>

          {/* Right Column - Response */}
          <div
            className="rounded-lg border p-6"
            style={{
              backgroundColor: "var(--bg-secondary)",
              borderColor: "var(--border)",
            }}
          >
            <h2 className="text-2xl font-bold mb-4 flex items-center justify-between">
              <span>📨 Response</span>
              {responseTime > 0 && (
                <span
                  className="text-sm px-3 py-1 rounded-full"
                  style={{
                    backgroundColor: "var(--primary)",
                    color: "#000",
                  }}
                >
                  {responseTime}ms
                </span>
              )}
            </h2>

            {response ? (
              <div className="space-y-3">
                {/* Response Code Block */}
                <pre
                  className="p-4 rounded-lg overflow-auto text-xs font-mono leading-relaxed max-h-96 border"
                  style={{
                    backgroundColor: "#1e1e1e",
                    borderColor: "var(--border)",
                    color: "#d4d4d4",
                  }}
                >
                  <code>{response}</code>
                </pre>

                {/* Copy Button */}
                <button
                  onClick={handleCopyResponse}
                  className="w-full px-4 py-2 rounded-lg font-semibold border transition"
                  style={{
                    borderColor: "var(--primary)",
                    color: "var(--primary)",
                  }}
                >
                  📋 Copy Response
                </button>
              </div>
            ) : (
              <div
                className="h-80 flex items-center justify-center rounded-lg border-2 border-dashed"
                style={{
                  borderColor: "var(--border)",
                  color: "var(--fg-secondary)",
                }}
              >
                <div className="text-center">
                  <p className="text-lg">No response yet</p>
                  <p className="text-sm">Send a request to see the response</p>
                </div>
              </div>
            )}

            {/* Stats */}
            {response && (
              <div
                className="mt-4 p-4 rounded-lg grid grid-cols-2 gap-4"
                style={{ backgroundColor: "var(--bg)" }}
              >
                <div>
                  <p
                    className="text-xs font-semibold mb-1"
                    style={{ color: "var(--fg-secondary)" }}
                  >
                    Response Time
                  </p>
                  <p
                    className="text-xl font-bold"
                    style={{ color: "var(--primary)" }}
                  >
                    {responseTime}ms
                  </p>
                </div>
                <div>
                  <p
                    className="text-xs font-semibold mb-1"
                    style={{ color: "var(--fg-secondary)" }}
                  >
                    Status
                  </p>
                  <p className="text-xl font-bold" style={{ color: "#10b981" }}>
                    ✓ Success
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
