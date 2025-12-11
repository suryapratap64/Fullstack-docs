"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

const highlightCode = (code, language) => {
  const keywords = {
    javascript: {
      keyword: [
        "function",
        "const",
        "let",
        "var",
        "if",
        "else",
        "for",
        "while",
        "return",
        "class",
        "async",
        "await",
        "new",
      ],
      type: ["String", "Number", "Boolean", "Array", "Object"],
    },
    python: {
      keyword: [
        "def",
        "class",
        "if",
        "else",
        "for",
        "while",
        "return",
        "import",
        "from",
        "async",
        "await",
        "None",
        "True",
        "False",
      ],
      type: ["str", "int", "list", "dict", "tuple"],
    },
    java: {
      keyword: [
        "public",
        "private",
        "static",
        "class",
        "interface",
        "void",
        "int",
        "String",
        "if",
        "else",
        "for",
        "while",
        "return",
        "new",
      ],
      type: ["String", "Integer", "Boolean", "List", "Map"],
    },
    cpp: {
      keyword: [
        "int",
        "void",
        "class",
        "struct",
        "if",
        "else",
        "for",
        "while",
        "return",
        "auto",
        "const",
        "new",
      ],
      type: ["string", "vector", "map", "pair"],
    },
  };

  let highlighted = code;
  const langKeywords = keywords[language] || {};

  highlighted = highlighted.replace(
    /"([^"]*)"/g,
    '<span style="color: #ce9178">"$1"</span>'
  );
  highlighted = highlighted.replace(
    /'([^']*)'/g,
    "<span style=\"color: #ce9178\">'$1'</span>"
  );

  highlighted = highlighted.replace(
    /\/\/.*$/gm,
    '<span style="color: #6a9955">// $&</span>'
  );
  highlighted = highlighted.replace(
    /\/\*[\s\S]*?\*\//g,
    (match) => `<span style="color: #6a9955">${match}</span>`
  );

  if (langKeywords.keyword) {
    langKeywords.keyword.forEach((keyword) => {
      const regex = new RegExp(`\\b${keyword}\\b`, "g");
      highlighted = highlighted.replace(
        regex,
        `<span style="color: #569cd6">${keyword}</span>`
      );
    });
  }

  highlighted = highlighted.replace(
    /\b\d+\b/g,
    '<span style="color: #b5cea8">$&</span>'
  );

  return highlighted;
};

export default function QuestionDetailPage({ params }) {
  const resolvedParams = React.use(params);
  const { id } = resolvedParams;
  const router = useRouter();
  const [question, setQuestion] = useState(null);
  const [loading, setLoading] = useState(true);
  const [codeCollapsed, setCodeCollapsed] = useState(false);

  useEffect(() => {
    fetchQuestion();
  }, [id]);

  const fetchQuestion = async () => {
    try {
      const res = await fetch("/api/dsa");
      if (!res.ok) throw new Error("Failed to load");
      const data = await res.json();
      const q = data.find((item) => item._id === id);

      if (!q) {
        toast.error("Question not found");
        router.back();
        return;
      }
      setQuestion(q);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load question");
      router.back();
    } finally {
      setLoading(false);
    }
  };

  const deleteQuestion = async () => {
    if (!confirm("Delete this question?")) return;
    try {
      const res = await fetch("/api/dsa", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ dsaId: id }),
      });
      if (res.ok) {
        toast.success("Question deleted!");
        router.back();
      } else {
        toast.error("Failed to delete");
      }
    } catch (err) {
      console.error(err);
      toast.error("Delete error");
    }
  };

  if (loading) {
    return (
      <div className="w-full h-screen flex items-center justify-center">
        <div className="animate-pulse space-y-4 w-full max-w-4xl px-4">
          <div className="h-12 bg-muted rounded w-1/2"></div>
          <div className="h-96 bg-muted rounded"></div>
        </div>
      </div>
    );
  }

  if (!question) return null;

  return (
    <div
      className="w-full min-h-screen"
      style={{ backgroundColor: "var(--bg)" }}
    >
      {/* Header */}
      <div
        className="border-b"
        style={{ backgroundColor: "var(--card)", borderColor: "var(--border)" }}
      >
        <div className="max-w-7xl mx-auto px-3 sm:px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => router.back()}
              className="text-sm text-fg-secondary hover:text-primary transition"
            >
              ← Back
            </button>
            <h1 className="text-xl sm:text-2xl font-bold text-fg">
              {question.title}
            </h1>
            <span
              className="px-2 py-1 text-xs rounded font-medium"
              style={{
                backgroundColor:
                  question.difficulty === "Easy"
                    ? "#d4edda"
                    : question.difficulty === "Medium"
                    ? "#fff3cd"
                    : "#f8d7da",
                color:
                  question.difficulty === "Easy"
                    ? "#155724"
                    : question.difficulty === "Medium"
                    ? "#856404"
                    : "#721c24",
              }}
            >
              {question.difficulty}
            </span>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => router.push(`/dsa/edit/${id}`)}
              className="px-3 py-2 text-xs rounded border transition hover:bg-secondary"
              style={{ borderColor: "var(--border)", color: "var(--fg)" }}
            >
              ✏️ Edit
            </button>
            {/* <button
              onClick={deleteQuestion}
              className="px-3 py-2 text-xs rounded border border-red-300 text-red-600 transition hover:bg-red-50"
            >
              🗑️ Delete
            </button> */}
          </div>
        </div>
      </div>

      {/* Two Column Layout */}
      <div className="flex">
        {/* Left Side - Problem Description */}
        <div
          className="w-full lg:w-1/2 border-r overflow-y-auto"
          style={{
            borderColor: "var(--border)",
            backgroundColor: "var(--bg)",
            maxHeight: "calc(100vh - 70px)",
          }}
        >
          <div className="p-6 space-y-6 max-w-2xl">
            {/* Tags */}
            {question.tags && question.tags.length > 0 && (
              <div>
                <p className="text-xs font-semibold text-fg-secondary mb-2">
                  Tags
                </p>
                <div className="flex flex-wrap gap-2">
                  {question.tags.map((tag, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-1 text-xs rounded"
                      style={{
                        backgroundColor: "var(--bg-secondary)",
                        color: "var(--primary)",
                      }}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Problem Statement */}
            <div>
              <h2
                className="text-lg font-bold text-fg mb-3"
                style={{ color: "var(--primary)" }}
              >
                📋 Problem Statement
              </h2>
              <p className="text-sm text-fg-secondary whitespace-pre-wrap leading-relaxed">
                {question.problemStatement}
              </p>
            </div>

            {/* Solution */}
            <div>
              <h2
                className="text-lg font-bold text-fg mb-3"
                style={{ color: "var(--primary)" }}
              >
                💡 Solution Approach
              </h2>
              <p className="text-sm text-fg-secondary whitespace-pre-wrap leading-relaxed">
                {question.solution}
              </p>
            </div>

            {/* Metadata */}
            <div
              className="pt-6 border-t"
              style={{ borderColor: "var(--border)" }}
            >
              <div className="grid grid-cols-2 gap-4 text-xs">
                <div>
                  <p className="text-fg-secondary mb-1">Language</p>
                  <p className="text-fg font-semibold capitalize">
                    {question.codeLanguage}
                  </p>
                </div>
                <div>
                  <p className="text-fg-secondary mb-1">Chapter</p>
                  <p className="text-fg font-semibold">{question.chapter}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Code Editor Style */}
        <div
          className="hidden lg:flex lg:w-1/2 flex-col"
          style={{
            backgroundColor: "#1e1e1e",
            maxHeight: "calc(100vh - 70px)",
            overflow: "hidden",
          }}
        >
          {/* Code Header */}
          <div
            className="flex items-center justify-between px-6 py-4 border-b"
            style={{
              backgroundColor: "#252526",
              borderColor: "#3e3e42",
            }}
          >
            <div className="flex items-center gap-3">
              <h3
                className="text-sm font-semibold"
                style={{ color: "#d4d4d4" }}
              >
                Solution Code
              </h3>
              <span
                className="text-xs px-2 py-1 rounded"
                style={{
                  backgroundColor: "var(--bg-secondary)",
                  color: "var(--primary)",
                }}
              >
                {question.codeLanguage.toUpperCase()}
              </span>
            </div>
            <button
              onClick={() => setCodeCollapsed(!codeCollapsed)}
              className="text-xs text-fg-secondary hover:text-primary transition"
            >
              {codeCollapsed ? "📂" : "📁"}
            </button>
          </div>

          {/* Code Content */}
          <div className="flex-1 overflow-y-auto p-6">
            <pre
              className="text-xs font-mono leading-relaxed"
              style={{
                color: "#d4d4d4",
                lineHeight: "1.6",
              }}
            >
              <code
                dangerouslySetInnerHTML={{
                  __html: highlightCode(question.code, question.codeLanguage),
                }}
              />
            </pre>
          </div>

          {/* Copy Button */}
          <div
            className="px-6 py-4 border-t"
            style={{
              backgroundColor: "#252526",
              borderColor: "#3e3e42",
            }}
          >
            <button
              onClick={() => {
                navigator.clipboard.writeText(question.code);
                toast.success("Code copied to clipboard!");
              }}
              className="w-full px-4 py-2 text-xs font-medium rounded transition"
              style={{
                backgroundColor: "var(--primary)",
                color: "#000",
              }}
            >
              📋 Copy Code
            </button>
          </div>
        </div>
      </div>

      {/* Mobile - Stack Layout */}
      <div className="lg:hidden">
        <div className="p-6 max-w-4xl mx-auto space-y-8">
          {/* Tags */}
          {question.tags && question.tags.length > 0 && (
            <div>
              <p className="text-xs font-semibold text-fg-secondary mb-2">
                Tags
              </p>
              <div className="flex flex-wrap gap-2">
                {question.tags.map((tag, idx) => (
                  <span
                    key={idx}
                    className="px-2 py-1 text-xs rounded"
                    style={{
                      backgroundColor: "var(--bg-secondary)",
                      color: "var(--primary)",
                    }}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Problem Statement */}
          <div>
            <h2
              className="text-lg font-bold text-fg mb-3"
              style={{ color: "var(--primary)" }}
            >
              📋 Problem Statement
            </h2>
            <p className="text-sm text-fg-secondary whitespace-pre-wrap leading-relaxed">
              {question.problemStatement}
            </p>
          </div>

          {/* Solution */}
          <div>
            <h2
              className="text-lg font-bold text-fg mb-3"
              style={{ color: "var(--primary)" }}
            >
              💡 Solution Approach
            </h2>
            <p className="text-sm text-fg-secondary whitespace-pre-wrap leading-relaxed">
              {question.solution}
            </p>
          </div>

          {/* Code */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h2
                className="text-lg font-bold text-fg"
                style={{ color: "var(--primary)" }}
              >
                💻 Code
              </h2>
              <span
                className="text-xs px-2 py-1 rounded font-medium"
                style={{
                  backgroundColor: "var(--bg-secondary)",
                  color: "var(--primary)",
                }}
              >
                {question.codeLanguage}
              </span>
            </div>
            <pre
              className="p-4 rounded-lg text-xs overflow-x-auto font-mono leading-relaxed border"
              style={{
                backgroundColor: "#1e1e1e",
                borderColor: "var(--border)",
                lineHeight: "1.6",
              }}
            >
              <code
                dangerouslySetInnerHTML={{
                  __html: highlightCode(question.code, question.codeLanguage),
                }}
                style={{ color: "#d4d4d4" }}
              />
            </pre>
            <button
              onClick={() => {
                navigator.clipboard.writeText(question.code);
                toast.success("Code copied!");
              }}
              className="mt-3 w-full px-4 py-2 text-xs font-medium rounded transition"
              style={{
                backgroundColor: "var(--primary)",
                color: "#000",
              }}
            >
              📋 Copy Code
            </button>
          </div>

          {/* Metadata */}
          <div
            className="pt-6 border-t"
            style={{ borderColor: "var(--border)" }}
          >
            <div className="grid grid-cols-2 gap-4 text-xs">
              <div>
                <p className="text-fg-secondary mb-1">Language</p>
                <p className="text-fg font-semibold capitalize">
                  {question.codeLanguage}
                </p>
              </div>
              <div>
                <p className="text-fg-secondary mb-1">Difficulty</p>
                <p className="text-fg font-semibold">{question.difficulty}</p>
              </div>
              <div>
                <p className="text-fg-secondary mb-1">Chapter</p>
                <p className="text-fg font-semibold">{question.chapter}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
