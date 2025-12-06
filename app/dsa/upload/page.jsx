"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import toast from "react-hot-toast";

const CHAPTERS = [
  { name: "Learn the basics", problems: 31, total: 31 },
  { name: "Learn Important Sorting Techniques", problems: 7, total: 7 },
  {
    name: "Solve Problems on Arrays [Easy -> Medium -> Hard]",
    problems: 40,
    total: 40,
  },
  {
    name: "Binary Search [1D, 2D Arrays, Search Space]",
    problems: 32,
    total: 32,
  },
  { name: "Strings [Basic and Medium]", problems: 15, total: 15 },
  {
    name: "Learn LinkedList [Single LL, Double LL, Medium, Hard Problems]",
    problems: 31,
    total: 31,
  },
  { name: "Recursion [PatternWise]", problems: 25, total: 25 },
  { name: "Bit Manipulation [Concepts & Problems]", problems: 18, total: 18 },
  {
    name: "Stack and Queues [Learning, Pre-In-Post-fix, Monotonic Stack, Implementation]",
    problems: 29,
    total: 30,
  },
  {
    name: "Sliding Window & Two Pointer Combined Problems",
    problems: 12,
    total: 12,
  },
  { name: "Heaps [Learning, Medium, Hard Problems]", problems: 15, total: 17 },
  { name: "Greedy Algorithms [Easy, Medium/Hard]", problems: 16, total: 16 },
  {
    name: "Binary Trees [Traversals, Medium and Hard Problems]",
    problems: 38,
    total: 39,
  },
  {
    name: "Binary Search Trees [Concept and Problems]",
    problems: 9,
    total: 16,
  },
  { name: "Graphs [Concepts & Problems]", problems: 54, total: 54 },
  {
    name: "Dynamic Programming [Patterns and Problems]",
    problems: 55,
    total: 56,
  },
  { name: "Tries", problems: 1, total: 7 },
  { name: "Strings", problems: 2, total: 9 },
];

export default function UploadPage() {
  return (
    <Suspense
      fallback={<div className="w-full px-4 py-6 text-center">Loading...</div>}
    >
      <UploadFormContent />
    </Suspense>
  );
}

function UploadFormContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const editId = searchParams.get("edit");

  const [formData, setFormData] = useState({
    chapter: "",
    title: "",
    difficulty: "Medium",
    problemStatement: "",
    solution: "",
    code: "",
    codeLanguage: "javascript",
    tags: "",
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (editId) {
      loadQuestion();
    }
  }, [editId]);

  const loadQuestion = async () => {
    try {
      const res = await fetch("/api/dsa");
      const data = await res.json();
      const question = data.find((q) => q._id === editId);
      if (question) {
        setFormData({
          chapter: question.chapter,
          title: question.title,
          difficulty: question.difficulty,
          problemStatement: question.problemStatement,
          solution: question.solution,
          code: question.code,
          codeLanguage: question.codeLanguage,
          tags: question.tags?.join(", ") || "",
        });
      }
    } catch (err) {
      toast.error("Failed to load question");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.chapter || !formData.title) {
      toast.error("Fill all fields");
      return;
    }

    setLoading(true);
    try {
      // Remove empty lines from problemStatement and solution only
      const cleanText = (text) => {
        return text
          .split("\n")
          .map((line) => line.trim())
          .filter((line) => line.length > 0)
          .join("\n");
      };

      const payload = {
        ...formData,
        problemStatement: cleanText(formData.problemStatement),
        solution: cleanText(formData.solution),
        code: formData.code,
        tags: formData.tags.split(",").map((t) => t.trim()),
      };

      if (editId) {
        payload.dsaId = editId;
        const res = await fetch("/api/dsa", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        if (res.ok) {
          toast.success("Updated");
          router.back();
        } else {
          toast.error("Failed to update");
        }
      } else {
        const res = await fetch("/api/dsa", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        if (res.ok) {
          toast.success("Added");
          setFormData({
            chapter: "",
            title: "",
            difficulty: "Medium",
            problemStatement: "",
            solution: "",
            code: "",
            codeLanguage: "javascript",
            tags: "",
          });
          setTimeout(() => router.push("/dsa"), 1000);
        } else {
          toast.error("Failed to add");
        }
      }
    } catch (err) {
      console.error(err);
      toast.error("Error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full px-3 sm:px-4 py-6">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => router.back()}
            className="text-sm text-fg-secondary hover:text-primary mb-3 transition"
          >
            ← Back to DSA
          </button>
          <h1 className="text-3xl sm:text-4xl font-bold text-fg mb-2">
            {editId ? "✏️ Edit Question" : "➕ Add New Question"}
          </h1>
          <p className="text-sm text-fg-secondary">
            {editId
              ? "Update the question details"
              : "Add a new DSA problem to your collection"}
          </p>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="space-y-6 bg-card p-6 rounded-lg border"
          style={{ borderColor: "var(--border)" }}
        >
          {/* Chapter Selection */}
          <div>
            <label className="block text-sm font-semibold text-fg mb-2">
              📚 Chapter *
            </label>
            <select
              name="chapter"
              value={formData.chapter}
              onChange={handleChange}
              className="w-full p-3 rounded-lg bg-secondary border text-sm input-card focus:border-primary focus:ring-2 focus:ring-primary focus:ring-opacity-20 transition"
              style={{ borderColor: "var(--border)" }}
            >
              <option value="">-- Select Chapter --</option>
              {CHAPTERS.map((ch) => (
                <option key={ch.name} value={ch.name}>
                  {ch.name}
                </option>
              ))}
            </select>
          </div>

          {/* Title */}
          <div>
            <label className="block text-sm font-semibold text-fg mb-2">
              🎯 Question Title *
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="e.g., Two Sum, Reverse String, etc."
              className="w-full p-3 rounded-lg bg-secondary border text-sm input-card focus:border-primary focus:ring-2 focus:ring-primary focus:ring-opacity-20 transition"
              style={{ borderColor: "var(--border)" }}
            />
          </div>

          {/* Difficulty & Language Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-fg mb-2">
                🏆 Difficulty
              </label>
              <select
                name="difficulty"
                value={formData.difficulty}
                onChange={handleChange}
                className="w-full p-3 rounded-lg bg-secondary border text-sm input-card focus:border-primary focus:ring-2 focus:ring-primary focus:ring-opacity-20 transition"
                style={{ borderColor: "var(--border)" }}
              >
                <option value="Easy">🟢 Easy</option>
                <option value="Medium">🟡 Medium</option>
                <option value="Hard">🔴 Hard</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-fg mb-2">
                💻 Code Language
              </label>
              <select
                name="codeLanguage"
                value={formData.codeLanguage}
                onChange={handleChange}
                className="w-full p-3 rounded-lg bg-secondary border text-sm input-card focus:border-primary focus:ring-2 focus:ring-primary focus:ring-opacity-20 transition"
                style={{ borderColor: "var(--border)" }}
              >
                <option value="javascript">JavaScript</option>
                <option value="python">Python</option>
                <option value="java">Java</option>
                <option value="cpp">C++</option>
              </select>
            </div>
          </div>

          {/* Problem Statement */}
          <div>
            <label className="block text-sm font-semibold text-fg mb-2">
              📋 Problem Statement *
            </label>
            <textarea
              name="problemStatement"
              value={formData.problemStatement}
              onChange={handleChange}
              placeholder="Describe the problem clearly..."
              className="w-full p-3 rounded-lg bg-secondary border text-sm input-card focus:border-primary focus:ring-2 focus:ring-primary focus:ring-opacity-20 transition min-h-28"
              style={{ borderColor: "var(--border)" }}
            />
          </div>

          {/* Solution */}
          <div>
            <label className="block text-sm font-semibold text-fg mb-2">
              💡 Solution Explanation
            </label>
            <textarea
              name="solution"
              value={formData.solution}
              onChange={handleChange}
              placeholder="Explain the approach, time complexity, space complexity..."
              className="w-full p-3 rounded-lg bg-secondary border text-sm input-card focus:border-primary focus:ring-2 focus:ring-primary focus:ring-opacity-20 transition min-h-28"
              style={{ borderColor: "var(--border)" }}
            />
          </div>

          {/* Code */}
          <div>
            <label className="block text-sm font-semibold text-fg mb-2">
              🔧 Code Implementation *
            </label>
            <textarea
              name="code"
              value={formData.code}
              onChange={handleChange}
              placeholder="Paste your complete code here..."
              className="w-full p-4 rounded-lg bg-secondary border text-xs input-card focus:border-primary focus:ring-2 focus:ring-primary focus:ring-opacity-20 transition min-h-48 font-mono"
              style={{ borderColor: "var(--border)" }}
            />
            <p className="text-xs text-fg-secondary mt-2">
              Code will be displayed with syntax highlighting
            </p>
          </div>

          {/* Tags */}
          <div>
            <label className="block text-sm font-semibold text-fg mb-2">
              🏷️ Tags
            </label>
            <input
              type="text"
              name="tags"
              value={formData.tags}
              onChange={handleChange}
              placeholder="e.g., hash-table, two-pointer, array (comma separated)"
              className="w-full p-3 rounded-lg bg-secondary border text-sm input-card focus:border-primary focus:ring-2 focus:ring-primary focus:ring-opacity-20 transition"
              style={{ borderColor: "var(--border)" }}
            />
          </div>

          {/* Buttons */}
          <div
            className="flex gap-3 pt-6 border-t"
            style={{ borderColor: "var(--border)" }}
          >
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-6 py-3 btn-primary rounded-lg font-medium transition disabled:opacity-50 hover:shadow-lg"
            >
              {loading
                ? "⏳ Saving..."
                : editId
                ? "✅ Update Question"
                : "➕ Add Question"}
            </button>
            <button
              type="button"
              onClick={() => router.back()}
              className="px-6 py-3 border rounded-lg text-sm font-medium transition hover:bg-secondary"
              style={{ borderColor: "var(--border)", color: "var(--fg)" }}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
