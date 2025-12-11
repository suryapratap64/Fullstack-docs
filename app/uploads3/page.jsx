"use client";

import { useState } from "react";

export default function UploadPage() {
  const [file, setFile] = useState(null);
  const [msg, setMsg] = useState("");

  const handleUpload = async () => {
    if (!file) return alert("Select a file first");

    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch("/api/s3upload", {
      method: "POST",
      body: formData,
    });

    const data = await res.json();
    setMsg(res.ok ? `Uploaded! URL: ${data.url}` : "Upload failed");
  };

  return (
    <div className="p-10 space-y-4">
      <input
        type="file"
        onChange={(e) => setFile(e.target.files?.[0] || null)}
      />
      <button
        onClick={handleUpload}
        className="bg-blue-600 px-4 py-2 text-white rounded hover:bg-blue-700"
      >
        Upload
      </button>
      <p>{msg}</p>
    </div>
  );
}
