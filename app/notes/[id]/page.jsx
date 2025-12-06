"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export default function NoteDetailsPage({ params }) {
  // params may be a Promise in newer Next.js versions — unwrap with React.use()
  const resolvedParams = React.use(params);
  const { id } = resolvedParams;
  const router = useRouter();
  const [note, setNote] = useState(null);
  const [loading, setLoading] = useState(true);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [editMode, setEditMode] = useState(false);

  useEffect(() => {
    fetchNote();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const fetchNote = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/notes");
      if (!res.ok) throw new Error("Failed to load notes");
      const data = await res.json();
      const n = data.find((i) => i._id === id) || null;
      if (!n) {
        toast.error("Note not found");
        router.back();
        return;
      }
      setNote(n);
      setTitle(n.title || "");
      setContent(n.content || "");
    } catch (err) {
      console.error(err);
      toast.error("Failed to load note");
      router.back();
    } finally {
      setLoading(false);
    }
  };

  const save = async () => {
    try {
      const res = await fetch("/api/notes", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ noteId: id, title, content }),
      });
      if (res.ok) {
        toast.success("Note updated");
        router.back();
      } else {
        toast.error("Failed to update note");
      }
    } catch (err) {
      console.error(err);
      toast.error("Update error");
    }
  };

  const remove = async () => {
    try {
      const res = await fetch("/api/notes", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ noteId: id }),
      });
      if (res.ok) {
        toast.success("Note deleted");
        router.back();
      } else {
        toast.error("Failed to delete note");
      }
    } catch (err) {
      console.error(err);
      toast.error("Delete error");
    }
  };

  if (loading)
    return <div className="w-full px-3 sm:px-4 py-6 text-xs">Loading...</div>;
  if (!note) return null;

  return (
    <div className="w-full px-3 sm:px-4 py-4">
      <div className="card p-3 sm:p-4 rounded-lg border shadow-sm max-w-2xl mx-auto">
        {/* reading-focused header */}
        <header className="mb-4 flex items-start justify-between gap-2">
          <div className="flex-1">
            {editMode ? (
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full text-lg sm:text-xl font-bold text-xs p-1 border rounded input-card outline-none mb-1"
              />
            ) : (
              <h1 className="text-lg sm:text-xl font-bold leading-tight text-fg">
                {title}
              </h1>
            )}
            <p className="mt-1 text-xs text-fg-secondary">Note</p>
          </div>
          <div className="flex items-center gap-1 flex-wrap justify-end">
            {editMode ? (
              <>
                <button
                  onClick={save}
                  className="px-2 py-1 btn-primary rounded text-xs font-medium"
                >
                  Save
                </button>
                <button
                  onClick={() => setEditMode(false)}
                  className="px-2 py-1 border rounded text-xs font-medium"
                  style={{
                    borderColor: "var(--border)",
                    color: "var(--fg-secondary)",
                  }}
                >
                  Cancel
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => setEditMode(true)}
                  className="px-2 py-1 btn-primary rounded text-xs font-medium"
                >
                  Edit
                </button>
                <button
                  onClick={() => router.back()}
                  className="px-2 py-1 border rounded text-xs font-medium"
                  style={{
                    borderColor: "var(--border)",
                    color: "var(--fg-secondary)",
                  }}
                >
                  Back
                </button>
              </>
            )}
          </div>
        </header>

        {editMode ? (
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full p-2 rounded text-xs input-card border resize-vertical outline-none min-h-40"
          />
        ) : (
          <article className="text-fg leading-6 whitespace-pre-wrap text-xs">
            {content}
          </article>
        )}
      </div>
    </div>
  );
}

let editMode = false;
