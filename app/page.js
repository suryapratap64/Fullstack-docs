"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import ThemeToggle from "../components/ThemeToggle";
import TaskCard from "../components/TaskCard";

export default function DashboardPage() {
  const router = useRouter();
  const [tab, setTab] = useState("notes");
  const [showNav, setShowNav] = useState(true);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [notes, setNotes] = useState([]);
  const [tasks, setTasks] = useState([]);

  const [newNote, setNewNote] = useState({ title: "", content: "" });
  const [newTask, setNewTask] = useState({
    english: "",
    meaning: "",
  });
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchNotes();
    fetchTasks();
  }, []);

  // Show navbar when scrolling down, hide when scrolling up
  useEffect(() => {
    let lastY = typeof window !== "undefined" ? window.scrollY || 0 : 0;
    let ticking = false;

    const onScroll = () => {
      const currentY = window.scrollY || 0;
      if (Math.abs(currentY - lastY) < 10) {
        // ignore small changes
        return;
      }
      if (!ticking) {
        window.requestAnimationFrame(() => {
          if (currentY > lastY) {
            // scrolling down -> hide nav
            setShowNav(false);
          } else {
            // scrolling up -> show nav
            setShowNav(true);
          }
          lastY = currentY;
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const fetchNotes = async () => {
    const res = await fetch("/api/notes");
    if (res.ok) {
      setNotes(await res.json());
    } else {
      toast.error("Failed to load notes");
    }
  };
  // ✅ Using .startsWith() ensures it matches letters from the start of the string.
  // const filteredNotes=notes.filter(note=>note.title.toLowerCase().startsWith(searchTerm.toLowerCase())||note.content.toLowerCase.startsWith(searchTerm.toLowerCase()));
  const filteredNotes = notes.filter((note) => {
    const title = note.title ? note.title.toLowerCase() : "";
    const content = note.content ? note.content.toLowerCase() : "";
    const search = searchTerm.toLowerCase();

    return title.includes(search) || content.includes(search);
  });

  const fetchTasks = async () => {
    const res = await fetch("/api/tasks", {
      credentials: "include",
    });
    if (res.ok) {
      const data = await res.json();
      console.log("Tasks fetched:", data);
      setTasks(data);
    } else {
      toast.error("Failed to load tasks");
    }
  };

  const addNote = async () => {
    if (!newNote.title || !newNote.content)
      return toast.error("Fill all fields");
    const res = await fetch("/api/notes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newNote),
    });
    if (res.ok) {
      toast.success("Note added");
      setNewNote({ title: "", content: "" });
      fetchNotes();
    } else {
      toast.error("Failed to add note");
    }
  };

  const updateNote = async (noteId, title, content) => {
    const res = await fetch("/api/notes", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ noteId, title, content }),
    });
    if (res.ok) {
      toast.success("Note updated");
      fetchNotes();
    } else {
      toast.error("Failed to update note");
    }
  };

  const deleteNote = async (noteId) => {
    const res = await fetch("/api/notes", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ noteId }),
    });
    if (res.ok) {
      toast.success("Note deleted");
      fetchNotes();
    } else {
      toast.error("Failed to delete note");
    }
  };

  const addTask = async () => {
    if (!newTask.english || !newTask.meaning)
      return toast.error("Fill all fields");
    const res = await fetch("/api/tasks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(newTask),
    });
    if (res.ok) {
      toast.success("Word added");
      setNewTask({
        english: "",
        meaning: "",
      });
      fetchTasks();
    } else {
      toast.error("Failed to add word");
    }
  };

  const updateTask = async (taskId, english, meaning) => {
    const res = await fetch("/api/tasks", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ taskId, english, meaning }),
    });
    if (res.ok) {
      toast.success("Word updated");
      fetchTasks();
    } else {
      toast.error("Failed to update word");
    }
  };

  const deleteTask = async (taskId) => {
    const res = await fetch("/api/tasks", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ taskId }),
    });
    if (res.ok) {
      toast.success("Task deleted");
      fetchTasks();
    } else {
      toast.error("Failed to delete task");
    }
  };

  const handleLogout = async () => {
    try {
      const res = await fetch("/api/logout", { method: "POST" });
      const data = await res.json();
      if (data.success) {
        toast.success("Logged out");
        router.push("/login");
      } else {
        toast.error("Failed to logout");
      }
    } catch (error) {
      toast.error("Logout failed");
    }
  };

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{ background: "var(--bg)", color: "var(--fg)" }}
    >
      {/* Navbar (fixed) */}
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transform transition-transform duration-300 ${
          showNav ? "translate-y-0" : "-translate-y-full"
        } border-b`}
        style={{ background: "var(--card)", borderColor: "var(--border)" }}
      >
        {/* Top Row: Logo + Hamburger */}
        <div className="w-full px-3 sm:px-4 py-3 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-2 flex-shrink-0">
            <h1
              className="text-2xl sm:text-3xl font-bold"
              style={{ color: "var(--primary)" }}
            >
              WorkSpace
            </h1>
            <p className="text-sm text-fg-secondary hidden sm:block">
              Notes & Tasks
            </p>
          </div>

          {/* Hamburger Menu Button (Mobile) */}
          <button
            onClick={() => setShowMobileMenu(!showMobileMenu)}
            className="sm:hidden flex flex-col gap-1.5 p-2 flex-shrink-0"
            aria-label="Toggle menu"
          >
            <span
              className="w-6 h-0.5 transition-all duration-300 origin-center"
              style={{
                background: "var(--primary)",
                transform: showMobileMenu
                  ? "rotate(45deg) translateY(8px)"
                  : "",
              }}
            ></span>
            <span
              className="w-6 h-0.5 transition-all duration-300"
              style={{
                background: "var(--primary)",
                opacity: showMobileMenu ? 0 : 1,
              }}
            ></span>
            <span
              className="w-6 h-0.5 transition-all duration-300 origin-center"
              style={{
                background: "var(--primary)",
                transform: showMobileMenu
                  ? "rotate(-45deg) translateY(-8px)"
                  : "",
              }}
            ></span>
          </button>
        </div>

        {/* Search Bar Below Logo */}
        <div
          className="w-full px-3 sm:px-4 py-2 border-t"
          style={{ borderColor: "var(--border)" }}
        >
          <input
            type="text"
            placeholder="Search notes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-3 py-2 rounded text-sm border input-card outline-none"
          />
        </div>

        {/* Desktop Navigation */}
        <div
          className="hidden sm:block w-full px-3 sm:px-4 py-2 border-t"
          style={{ borderColor: "var(--border)" }}
        >
          <div className="flex items-center gap-2">
            <button
              onClick={() => setTab("notes")}
              aria-pressed={tab === "notes"}
              className={`px-3 py-2 rounded text-sm font-medium transition ${
                tab === "notes" ? "btn-primary" : "border"
              }`}
              style={
                tab === "notes"
                  ? {}
                  : {
                      borderColor: "var(--border)",
                      color: "var(--fg-secondary)",
                    }
              }
            >
              WebD
            </button>
            <button
              onClick={() => setTab("tasks")}
              aria-pressed={tab === "tasks"}
              className={`px-3 py-2 rounded text-sm font-medium transition ${
                tab === "tasks" ? "btn-primary" : "border"
              }`}
              style={
                tab === "tasks"
                  ? {}
                  : {
                      borderColor: "var(--border)",
                      color: "var(--fg-secondary)",
                    }
              }
            >
              Tasks
            </button>
            <button
              onClick={() => router.push("/gpt-month")}
              className="px-3 py-2 rounded text-sm font-medium border transition hover:bg-secondary"
            >
              GPT
            </button>
            <button
              onClick={() => router.push("/dsa")}
              className="px-3 py-2 rounded text-sm font-medium border transition hover:bg-secondary"
              style={{
                borderColor: "var(--primary)",
                color: "var(--primary)",
              }}
            >
              DSA
            </button>
            <button
              onClick={handleLogout}
              className="px-3 py-2 rounded text-sm font-medium border"
              style={{
                borderColor: "var(--border)",
                color: "var(--fg-secondary)",
              }}
            >
              Logout
            </button>
            <div className="ml-auto">
              <ThemeToggle />
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {showMobileMenu && (
          <div
            className="sm:hidden border-t"
            style={{ borderColor: "var(--border)" }}
          >
            <div className="px-3 py-4 space-y-2">
              <button
                onClick={() => {
                  setTab("notes");
                  setShowMobileMenu(false);
                }}
                aria-pressed={tab === "notes"}
                className={`w-full px-3 py-2 rounded text-sm font-medium transition text-left ${
                  tab === "notes" ? "btn-primary" : "border"
                }`}
                style={
                  tab === "notes"
                    ? {}
                    : {
                        borderColor: "var(--border)",
                        color: "var(--fg-secondary)",
                      }
                }
              >
                WebD
              </button>
              <button
                onClick={() => {
                  setTab("tasks");
                  setShowMobileMenu(false);
                }}
                aria-pressed={tab === "tasks"}
                className={`w-full px-3 py-2 rounded text-sm font-medium transition text-left ${
                  tab === "tasks" ? "btn-primary" : "border"
                }`}
                style={
                  tab === "tasks"
                    ? {}
                    : {
                        borderColor: "var(--border)",
                        color: "var(--fg-secondary)",
                      }
                }
              >
                Tasks
              </button>
              <button
                onClick={() => {
                  router.push("/gpt-month");
                  setShowMobileMenu(false);
                }}
                className="w-full px-3 py-2 rounded text-sm font-medium border transition hover:bg-secondary text-left"
              >
                GPT
              </button>
              <button
                onClick={() => {
                  router.push("/dsa");
                  setShowMobileMenu(false);
                }}
                className="w-full px-3 py-2 rounded text-sm font-medium border transition hover:bg-secondary text-left"
                style={{
                  borderColor: "var(--primary)",
                  color: "var(--primary)",
                }}
              >
                DSA
              </button>
              <button
                onClick={handleLogout}
                className="w-full px-3 py-2 rounded text-sm font-medium border text-left"
                style={{
                  borderColor: "var(--border)",
                  color: "var(--fg-secondary)",
                }}
              >
                Logout
              </button>
              <div className="pt-2 flex justify-center">
                <ThemeToggle />
              </div>
            </div>
          </div>
        )}
      </nav>

      <main className="flex  w-full pt-20 ">
        <div className="w-full  mx-auto max-w-7xl">
          <div className="card rounded-lg shadow-sm">
            {tab === "notes" && (
              <section className="p-1 sm:p-2">
                <div className="flex flex-col sm:flex-row sm:items-start sm:gap-3 mb-6">
                  <h2
                    className="text-xl sm:text-2xl font-bold mb-3 sm:mb-0"
                    style={{ color: "var(--primary)" }}
                  >
                    Your Notes
                  </h2>
                  <div className="flex-1" />
                </div>

                {/* Add new note */}
                <div className="mb-8 grid grid-cols-1 sm:grid-cols-3 gap-3 mt-5">
                  <input
                    type="text"
                    aria-label="Note title"
                    placeholder="Title"
                    value={newNote.title}
                    onChange={(e) =>
                      setNewNote({ ...newNote, title: e.target.value })
                    }
                    className="sm:col-span-1 col-span-1 p-3 rounded text-sm input-card border outline-none"
                  />
                  <textarea
                    aria-label="Note content"
                    placeholder="Content"
                    value={newNote.content}
                    onChange={(e) =>
                      setNewNote({ ...newNote, content: e.target.value })
                    }
                    className="sm:col-span-2 col-span-1 p-3 rounded text-sm input-card border resize-vertical outline-none"
                  />
                  <div className="sm:col-span-3 flex justify-end">
                    <button
                      onClick={addNote}
                      className="inline-flex items-center gap-2 btn-primary px-6  py-3 rounded text-sm font-medium"
                    >
                      Add Note
                    </button>
                  </div>
                </div>

                {/* Notes list */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {filteredNotes.length > 0 ? (
                    filteredNotes.map((note) => (
                      <NoteCard
                        key={note._id}
                        note={note}
                        onUpdate={updateNote}
                        onDelete={deleteNote}
                      />
                    ))
                  ) : (
                    <p className="text-xs text-fg-secondary">No notes found</p>
                  )}
                </div>
              </section>
            )}

            {tab === "tasks" && (
              <section className="p-4 sm:p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2
                    className="text-xl sm:text-2xl font-bold"
                    style={{ color: "var(--primary)" }}
                  >
                    English Words
                  </h2>
                </div>

                {/* Add Word Form */}
                <div className="mb-8 grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <input
                    type="text"
                    aria-label="English"
                    placeholder="English"
                    value={newTask.english}
                    onChange={(e) =>
                      setNewTask({ ...newTask, english: e.target.value })
                    }
                    className="sm:col-span-1 col-span-1 p-3 rounded text-sm input-card border outline-none"
                  />
                  <textarea
                    aria-label="Meaning"
                    placeholder="Meaning"
                    value={newTask.meaning}
                    onChange={(e) =>
                      setNewTask({ ...newTask, meaning: e.target.value })
                    }
                    className="sm:col-span-1 col-span-1 p-3 rounded text-sm input-card border resize-vertical outline-none min-h-12"
                  />
                  <div className="flex items-end">
                    <button
                      onClick={addTask}
                      className="w-full btn-primary px-6 py-3 rounded text-sm font-medium"
                    >
                      Add
                    </button>
                  </div>
                </div>

                {/* Words Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {tasks && tasks.length > 0 ? (
                    tasks.map((task) => (
                      <TaskCard
                        key={task._id}
                        task={task}
                        onUpdate={updateTask}
                        onDelete={deleteTask}
                      />
                    ))
                  ) : (
                    <p className="text-xs text-fg-secondary">No words yet</p>
                  )}
                </div>
              </section>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

function NoteCard({ note, onUpdate, onDelete }) {
  const [edit, setEdit] = useState(false);
  const [form, setForm] = useState({
    title: note.title,
    content: note.content,
  });
  const [summary, setSummary] = useState("");
  const [loading, setLoading] = useState(false);
  const [showSummary, setShowSummary] = useState(false);
  const router = useRouter();

  const save = () => {
    onUpdate(note._id, form.title, form.content);
    setEdit(false);
  };

  const handleSummarize = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/summarize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: note.content }),
      });
      const data = await res.json();
      setSummary(data.summary || "No summary found.");
      setShowSummary(true);
    } catch (err) {
      console.error("Failed to summarize:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card p-4 rounded shadow-sm transition-all duration-300 overflow-hidden w-full border">
      {edit ? (
        <div className="space-y-2">
          <input
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            className="w-full p-2 border rounded text-sm input-card outline-none"
          />
          <textarea
            value={form.content}
            onChange={(e) => setForm({ ...form, content: e.target.value })}
            className="w-full p-2 border rounded text-sm input-card resize-vertical outline-none"
          />
          <div className="flex gap-2">
            <button
              onClick={save}
              className="px-3 py-2 btn-primary rounded text-sm font-medium"
            >
              Save
            </button>
            <button
              onClick={() => setEdit(false)}
              className="px-3 py-2 border rounded text-sm font-medium"
              style={{
                borderColor: "var(--border)",
                color: "var(--fg-secondary)",
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <>
          <h3
            className="font-semibold cursor-pointer text-sm sm:text-base hover:opacity-80 transition"
            onClick={() => router.push(`/notes/${note._id}`)}
            style={{ color: "var(--primary)" }}
          >
            {note.title}
          </h3>
          <p className="text-fg text-sm whitespace-pre-wrap mb-3">
            {note.content}
          </p>
          <div className="flex gap-2 mt-3 flex-wrap">
            <button
              onClick={() => setEdit(true)}
              className="px-3 py-2 btn-primary rounded text-sm"
            >
              Edit
            </button>
            <button
              onClick={handleSummarize}
              disabled={loading}
              className="px-3 py-2 border rounded text-sm font-medium"
              style={{
                borderColor: "var(--border)",
                color: "var(--fg-secondary)",
              }}
            >
              {loading ? "Summarizing..." : "Summarize"}
            </button>
          </div>
          {/* Summary slides in */}
          <div
            className={`transition-all duration-500 ${
              showSummary ? "max-h-40 mt-2" : "max-h-0 overflow-hidden"
            }`}
          >
            {summary && (
              <p className="mt-1 text-xs" style={{ color: "var(--primary)" }}>
                <strong>Summary:</strong> {summary}
              </p>
            )}
          </div>
        </>
      )}
    </div>
  );
}

// TaskItem Component here
function TaskItem({ task, onUpdate, onDelete }) {
  const [text, setText] = useState(task.text);
  const router = useRouter();

  const save = () => onUpdate(task._id, text, task.done);
  const toggleDone = () => onUpdate(task._id, text, !task.done);

  return (
    <div className="card p-3 rounded shadow-sm flex justify-between items-center border">
      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          checked={task.done}
          onChange={toggleDone}
          className="w-5 h-5"
        />
        <button
          onClick={() => router.push(`/tasks/${task._id}`)}
          className="text-left flex-1"
        >
          <input
            value={text}
            onChange={(e) => setText(e.target.value)}
            onBlur={save}
            className="w-full p-2 text-sm border-b bg-transparent text-fg outline-none"
            style={{ borderColor: "var(--border)" }}
          />
        </button>
      </div>
      <button
        onClick={() => onDelete(task._id)}
        className="px-3 py-2 border rounded text-sm font-medium"
        style={{ borderColor: "var(--border)", color: "var(--fg-secondary)" }}
      >
        Delete
      </button>
    </div>
  );
}
// thanks sir for this oppertunity;
