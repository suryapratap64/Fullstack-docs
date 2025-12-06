"use client";

import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

export default function TaskDetailsPage({ params }) {
  const { id } = params;
  const router = useRouter();
  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(true);
  const [text, setText] = useState("");
  const [done, setDone] = useState(false);

  useEffect(() => {
    fetchTask();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const fetchTask = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/tasks");
      if (!res.ok) throw new Error("Failed to load tasks");
      const data = await res.json();
      const t = data.find((i) => i._id === id) || null;
      if (!t) {
        toast.error("Task not found");
        router.back();
        return;
      }
      setTask(t);
      setText(t.text || "");
      setDone(!!t.done);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load task");
      router.back();
    } finally {
      setLoading(false);
    }
  };

  const save = async () => {
    try {
      const res = await fetch("/api/tasks", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ taskId: id, text, done }),
      });
      if (res.ok) {
        toast.success("Task updated");
        router.back();
      } else {
        toast.error("Failed to update task");
      }
    } catch (err) {
      console.error(err);
      toast.error("Update error");
    }
  };

  const remove = async () => {
    try {
      const res = await fetch("/api/tasks", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ taskId: id }),
      });
      if (res.ok) {
        toast.success("Task deleted");
        router.back();
      } else {
        toast.error("Failed to delete task");
      }
    } catch (err) {
      console.error(err);
      toast.error("Delete error");
    }
  };

  if (loading)
    return (
      <div className="w-full px-3 sm:px-4 py-6">
        <div className="bg-card rounded-lg border shadow-sm p-3 animate-pulse">
          <div className="h-6 bg-muted rounded w-1/4 mb-4"></div>
          <div className="h-24 bg-muted rounded mb-4"></div>
          <div className="h-5 bg-muted rounded w-1/3"></div>
        </div>
      </div>
    );
  if (!task) return null;

  return (
    <div className="w-full px-3 sm:px-4 py-4 font-sans">
      <div className="bg-card rounded-lg border shadow-sm p-3 max-w-2xl mx-auto">
        <div className="flex justify-between items-center mb-4">
          <h2
            className="text-lg sm:text-xl font-bold"
            style={{ color: "var(--primary)" }}
          >
            Task Details
          </h2>
          <button
            onClick={() => router.back()}
            className="px-2 sm:px-3 py-1 text-xs font-medium border rounded transition"
            style={{
              borderColor: "var(--border)",
              color: "var(--fg-secondary)",
            }}
          >
            ← Back
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-fg-secondary mb-1">
              Description
            </label>
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              className="w-full p-2 rounded-lg bg-bg-secondary border text-xs input-card focus:border-primary focus:ring-1 focus:ring-primary focus:ring-opacity-20 transition-colors leading-relaxed min-h-24"
              placeholder="Enter task description..."
              style={{ borderColor: "var(--border)" }}
            />
          </div>

          <div className="flex items-center gap-2 py-1">
            <input
              id="done"
              type="checkbox"
              checked={done}
              onChange={() => setDone((d) => !d)}
              className="w-4 h-4 border rounded"
              style={{ borderColor: "var(--border)" }}
            />
            <label htmlFor="done" className="text-xs font-medium text-fg">
              Mark as completed
            </label>
          </div>

          <div
            className="flex gap-2 pt-2 border-t"
            style={{ borderColor: "var(--border)" }}
          >
            <button
              onClick={save}
              className="px-3 py-1 btn-primary rounded text-xs font-medium transition"
            >
              Save Changes
            </button>
            <button
              onClick={remove}
              className="px-3 py-1 border rounded text-xs font-medium transition"
              style={{
                borderColor: "var(--border)",
                color: "var(--fg-secondary)",
              }}
            >
              Delete Task
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
