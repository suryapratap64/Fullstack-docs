"use client";

import { useState } from "react";

export default function TaskCard({ task, onUpdate, onDelete }) {
  const [edit, setEdit] = useState(false);
  const [form, setForm] = useState({
    english: task.english,
    meaning: task.meaning,
  });

  const save = () => {
    onUpdate(task._id, form.english, form.meaning);
    setEdit(false);
  };

  const handleDelete = () => {
    if (confirm("Delete this word?")) {
      onDelete(task._id);
    }
  };

  if (edit) {
    return (
      <div
        className="p-4 rounded-lg border"
        style={{ background: "var(--card-bg)", borderColor: "var(--border)" }}
      >
        <input
          type="text"
          value={form.english}
          onChange={(e) => setForm({ ...form, english: e.target.value })}
          placeholder="English"
          className="w-full p-2 rounded text-sm input-card border outline-none mb-2"
        />
        <textarea
          value={form.meaning}
          onChange={(e) => setForm({ ...form, meaning: e.target.value })}
          placeholder="Meaning"
          className="w-full p-2 rounded text-sm input-card border outline-none min-h-16 mb-2"
        />
        <div className="flex gap-2 justify-end">
          <button
            onClick={save}
            className="px-3 py-1 rounded text-xs font-medium btn-primary"
          >
            Save
          </button>
          <button
            onClick={() => setEdit(false)}
            className="px-3 py-1 rounded text-xs font-medium border"
            style={{ borderColor: "var(--border)" }}
          >
            Cancel
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      className="p-4 rounded-lg border transition-all hover:shadow-md"
      style={{ background: "var(--card-bg)", borderColor: "var(--border)" }}
    >
      <div className="flex items-center gap-2 mb-3">
        <h3
          className="font-semibold text-sm"
          style={{ color: "var(--primary)" }}
        >
          {task.english}
        </h3>
        <p className="text-xs" style={{ color: "#FCD34D" }}>
          [{task.meaning}]
        </p>
      </div>
      <div className="flex gap-2">
        <button
          onClick={() => setEdit(true)}
          className="px-3 py-1 rounded text-xs font-medium btn-primary"
        >
          Edit
        </button>
        <button
          onClick={handleDelete}
          className="px-3 py-1 rounded text-xs font-medium border"
          style={{ borderColor: "var(--border)" }}
        >
          Delete
        </button>
      </div>
    </div>
  );
}
