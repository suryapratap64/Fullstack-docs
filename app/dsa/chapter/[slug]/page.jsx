"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
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

// Generate slug from chapter name
const generateSlug = (name) => {
  return name
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-");
};

// Create dynamic map
const CHAPTER_MAP = {};
CHAPTERS.forEach((ch) => {
  CHAPTER_MAP[generateSlug(ch.name)] = ch.name;
});

// const CHAPTER_MAP = {
//   "learn-the-basics": "Learn the basics",
//   "learn-important-sorting-techniques": "Learn Important Sorting Techniques",
//   "solve-problems-on-arrays-easy-medium-hard":
//     "Solve Problems on Arrays [Easy -> Medium -> Hard]",
//   "binary-search-1d-2d-arrays-search-space":
//     "Binary Search [1D, 2D Arrays, Search Space]",
//   "strings-basic-and-medium": "Strings [Basic and Medium]",
//   "learn-linkedlist-single-ll-double-ll-medium-hard-problems":
//     "Learn LinkedList [Single LL, Double LL, Medium, Hard Problems]",
//   "recursion-patternwise": "Recursion [PatternWise]",
//   "bit-manipulation-concepts-problems":
//     "Bit Manipulation [Concepts & Problems]",
//   "stack-and-queues-learning-pre-in-post-fix-monotonic-stack-implementation":
//     "Stack and Queues [Learning, Pre-In-Post-fix, Monotonic Stack, Implementation]",
//   "sliding-window-two-pointer-combined-problems":
//     "Sliding Window & Two Pointer Combined Problems",
//   "heaps-learning-medium-hard-problems":
//     "Heaps [Learning, Medium, Hard Problems]",
//   "greedy-algorithms-easy-mediumhard": "Greedy Algorithms [Easy, Medium/Hard]",
//   "binary-trees-traversals-medium-and-hard-problems":
//     "Binary Trees [Traversals, Medium and Hard Problems]",
//   "binary-search-trees-concept-and-problems":
//     "Binary Search Trees [Concept and Problems]",
//   "graphs-concepts-problems": "Graphs [Concepts & Problems]",
//   "dynamic-programming-patterns-and-problems":
//     "Dynamic Programming [Patterns and Problems]",
//   tries: "Tries",
//   strings: "Strings",
// };

// Simple syntax highlighter
const highlightCode = (code, language) => {
  // Color keywords for JavaScript
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
      ],
      type: ["String", "Integer", "Boolean", "List", "Map"],
    },
    cpp: {
      keyword: [
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
        "public",
        "private",
        "swap",
      ],
      type: [
        "int",
        "string",
        "vector",
        "map",
        "pair",
        "bool",
        "float",
        "double",
      ],
    },
  };

  let highlighted = code;
  const langKeywords = keywords[language] || {};

  // Highlight strings
  highlighted = highlighted.replace(
    /"([^"]*)"/g,
    '<span style="color: #ce9178">"$1"</span>'
  );
  highlighted = highlighted.replace(
    /'([^']*)'/g,
    "<span style=\"color: #ce9178\">'$1'</span>"
  );

  // Highlight comments
  highlighted = highlighted.replace(
    /\/\/.*$/gm,
    '<span style="color: #6a9955">$&</span>'
  );
  highlighted = highlighted.replace(
    /\/\*[\s\S]*?\*\//g,
    (match) => `<span style="color: #6a9955">${match}</span>`
  );

  // Highlight type keywords first (YELLOW)
  if (langKeywords.type) {
    langKeywords.type.forEach((type) => {
      const regex = new RegExp(`\\b${type}\\b`, "g");
      highlighted = highlighted.replace(
        regex,
        `<span style="color: #ffc01d"><strong>${type}</strong></span>`
      );
    });
  }

  // Highlight control keywords (BLUE)
  if (langKeywords.keyword) {
    langKeywords.keyword.forEach((keyword) => {
      const regex = new RegExp(`\\b${keyword}\\b`, "g");
      highlighted = highlighted.replace(
        regex,
        `<span style="color: #569cd6"><strong>${keyword}</strong></span>`
      );
    });
  }

  // Highlight numbers (GREEN)
  highlighted = highlighted.replace(
    /\b\d+\b/g,
    '<span style="color: #b5cea8">$&</span>'
  );

  // Highlight operators (GRAY)
  highlighted = highlighted.replace(
    /([=+\-*/<>!&|%(){}\[\];:,.])/g,
    '<span style="color: #d4d4d4">$1</span>'
  );

  return highlighted;
};

export default function ChapterPage({ params }) {
  const resolvedParams = React.use(params);
  const { slug } = resolvedParams;
  const chapterName = CHAPTER_MAP[slug] || "Chapter";
  const router = useRouter();
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState(null);

  useEffect(() => {
    fetchQuestions();
  }, [slug]);

  const fetchQuestions = async () => {
    try {
      const res = await fetch("/api/dsa");
      if (!res.ok) throw new Error("Failed to load");
      const data = await res.json();
      console.log("All DSA questions:", data);
      console.log("Looking for chapter:", chapterName);
      const filtered = data.filter((q) => {
        console.log(
          "Comparing:",
          q.chapter,
          "===",
          chapterName,
          "=>",
          q.chapter === chapterName
        );
        return q.chapter === chapterName;
      });
      console.log("Filtered questions:", filtered);
      setQuestions(filtered);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load questions");
    } finally {
      setLoading(false);
    }
  };

  const deleteQuestion = async (id) => {
    if (!confirm("Delete this question?")) return;
    try {
      const res = await fetch("/api/dsa", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ dsaId: id }),
      });
      if (res.ok) {
        toast.success("Deleted");
        setQuestions(questions.filter((q) => q._id !== id));
      } else {
        toast.error("Failed to delete");
      }
    } catch (err) {
      console.error(err);
      toast.error("Delete error");
    }
  };

  if (loading)
    return (
      <div
        className="w-full min-h-screen"
        style={{ backgroundColor: "var(--bg)" }}
      >
        <div className="px-6 sm:px-8 py-8 animate-pulse space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-24 bg-muted rounded-lg"></div>
          ))}
        </div>
      </div>
    );

  return (
    <div
      className="w-full min-h-screen"
      style={{ backgroundColor: "var(--bg)" }}
    >
      <div className="px-6 sm:px-8 py-8 w-full">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <button
              onClick={() => router.back()}
              className="text-sm text-fg-secondary hover:text-fg mb-2"
            >
              ← Back
            </button>
            <h1 className="text-2xl sm:text-3xl font-bold text-fg">
              {chapterName}
            </h1>
            <p className="text-sm text-fg-secondary mt-1">
              {questions.length} questions
            </p>
          </div>
          <button
            onClick={() => router.push("/dsa/upload")}
            className="px-4 py-2 btn-primary rounded text-sm font-medium"
          >
            + Add
          </button>
        </div>

        {/* Questions List */}
        {questions.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-fg-secondary text-sm">No questions yet</p>
            <button
              onClick={() => router.push("/dsa/upload")}
              className="mt-4 px-4 py-2 btn-primary rounded text-sm"
            >
              Add First Question
            </button>
          </div>
        ) : (
          <div className="space-y-3 ">
            {questions.map((question) => (
              <div
                key={question._id}
                className="bg-card rounded-lg border shadow-sm overflow-hidden"
                style={{ borderColor: "var(--border)" }}
              >
                {/* Question Header - Clickable */}
                <button
                  onClick={() =>
                    setExpandedId(
                      expandedId === question._id ? null : question._id
                    )
                  }
                  className="w-full p-4 text-left flex items-start justify-between hover:bg-secondary transition"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3
                        className="text-base sm:text-lg font-semibold text-fg"
                        style={{ color: "var(--primary)" }}
                      >
                        {question.title}
                      </h3>
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
                    <p className="text-xs sm:text-sm text-fg-secondary">
                      {question.tags?.join(", ")}
                    </p>
                  </div>
                  <span
                    className="ml-2 transition"
                    style={{
                      transform:
                        expandedId === question._id ? "rotate(180deg)" : "",
                    }}
                  >
                    ▼
                  </span>
                </button>

                {/* Expanded Content - Two Column Layout */}
                {expandedId === question._id && (
                  <div
                    className="border-t"
                    style={{ borderColor: "var(--border)" }}
                  >
                    {/* Desktop: Two Column */}
                    <div className="hidden md:grid md:grid-cols-2">
                      {/* Left Column - Problem Summary */}
                      <div
                        className="p-6 border-r"
                        style={{ borderColor: "var(--border)" }}
                      >
                        {/* Problem Statement */}
                        <div className="mb-6">
                          <h4 className="text-sm font-semibold text-fg mb-3">
                            📋 Problem Statement
                          </h4>
                          <p className="text-xs sm:text-sm text-fg-secondary whitespace-pre-wrap leading-relaxed">
                            {question.problemStatement}
                          </p>
                        </div>

                        {/* Solution */}
                        <div className="mb-6">
                          <h4 className="text-sm font-semibold text-fg mb-3">
                            ✅ Solution
                          </h4>
                          <p className="text-xs sm:text-sm text-fg-secondary whitespace-pre-wrap leading-relaxed">
                            {question.solution}
                          </p>
                        </div>

                        {/* Tags */}
                        {question.tags && question.tags.length > 0 && (
                          <div className="mb-6">
                            <h4 className="text-sm font-semibold text-fg mb-2">
                              🏷️ Tags
                            </h4>
                            <div className="flex flex-wrap gap-2">
                              {question.tags.map((tag, idx) => (
                                <span
                                  key={idx}
                                  className="text-xs px-2 py-1 rounded"
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

                        {/* Actions */}
                        <div
                          className="flex gap-2 pt-4 border-t"
                          style={{ borderColor: "var(--border)" }}
                        >
                          <button
                            onClick={() =>
                              router.push(`/dsa/edit/${question._id}`)
                            }
                            className="px-3 py-2 text-xs rounded border transition hover:bg-secondary"
                            style={{
                              borderColor: "var(--border)",
                              color: "var(--fg)",
                            }}
                          >
                            ✏️ Edit
                          </button>
                          <button
                            onClick={() => deleteQuestion(question._id)}
                            className="px-3 py-2 text-xs rounded border border-red-300 text-red-600 transition hover:bg-red-50"
                          >
                            🗑️ Delete
                          </button>
                        </div>
                      </div>

                      {/* Right Column - Code Editor Style */}
                      <div
                        className="p-6 flex flex-col"
                        style={{ backgroundColor: "#1e1e1e" }}
                      >
                        {/* Code Header */}
                        <div className="flex items-center justify-between mb-4">
                          <h4
                            className="text-sm font-semibold"
                            style={{ color: "#d4d4d4" }}
                          >
                            💻 Code Solution
                          </h4>
                          <span
                            className="text-xs px-2 py-1 rounded font-medium"
                            style={{
                              backgroundColor: "var(--primary)",
                              color: "#000",
                            }}
                          >
                            {question.codeLanguage}
                          </span>
                        </div>

                        {/* Code Block */}
                        <pre
                          className="flex-1 p-4 rounded-lg text-xs overflow-auto font-mono leading-relaxed border"
                          style={{
                            backgroundColor: "#1e1e1e",
                            borderColor: "#333",
                            lineHeight: "1.6",
                            minHeight: "300px",
                            color: "#d4d4d4",
                            whiteSpace: "pre-wrap",
                            wordWrap: "break-word",
                          }}
                        >
                          {question.code}
                        </pre>

                        {/* Copy Button */}
                        <button
                          onClick={() => {
                            navigator.clipboard.writeText(question.code);
                            toast.success("Code copied!");
                          }}
                          className="mt-4 w-full px-4 py-2 text-xs font-medium rounded transition"
                          style={{
                            backgroundColor: "var(--primary)",
                            color: "#000",
                          }}
                        >
                          📋 Copy Code
                        </button>
                      </div>
                    </div>

                    {/* Mobile: Stacked */}
                    <div className="md:hidden space-y-4 p-4">
                      {/* Problem Statement */}
                      <div>
                        <h4 className="text-sm font-semibold text-fg mb-2">
                          📋 Problem Statement
                        </h4>
                        <p className="text-xs text-fg-secondary whitespace-pre-wrap">
                          {question.problemStatement}
                        </p>
                      </div>

                      {/* Solution */}
                      <div
                        className="pt-4 border-t"
                        style={{ borderColor: "var(--border)" }}
                      >
                        <h4 className="text-sm font-semibold text-fg mb-2">
                          ✅ Solution
                        </h4>
                        <p className="text-xs text-fg-secondary whitespace-pre-wrap">
                          {question.solution}
                        </p>
                      </div>

                      {/* Code */}
                      <div
                        className="pt-4 border-t"
                        style={{ borderColor: "var(--border)" }}
                      >
                        <div className="flex items-center justify-between mb-3">
                          <h4 className="text-sm font-semibold text-fg">
                            💻 Code Solution
                          </h4>
                          <span
                            className="text-xs px-2 py-1 rounded font-medium"
                            style={{
                              backgroundColor: "var(--primary)",
                              color: "#000",
                            }}
                          >
                            {question.codeLanguage}
                          </span>
                        </div>
                        <pre
                          className="p-3 rounded text-xs overflow-x-auto font-mono leading-relaxed border"
                          style={{
                            backgroundColor: "#1e1e1e",
                            borderColor: "#333",
                            color: "#d4d4d4",
                            whiteSpace: "pre-wrap",
                            wordWrap: "break-word",
                          }}
                        >
                          {question.code}
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

                      {/* Tags */}
                      {question.tags && question.tags.length > 0 && (
                        <div
                          className="pt-4 border-t"
                          style={{ borderColor: "var(--border)" }}
                        >
                          <h4 className="text-sm font-semibold text-fg mb-2">
                            🏷️ Tags
                          </h4>
                          <div className="flex flex-wrap gap-2">
                            {question.tags.map((tag, idx) => (
                              <span
                                key={idx}
                                className="text-xs px-2 py-1 rounded"
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

                      {/* Actions */}
                      <div
                        className="flex gap-2 pt-4 border-t"
                        style={{ borderColor: "var(--border)" }}
                      >
                        <button
                          onClick={() =>
                            router.push(`/dsa/edit/${question._id}`)
                          }
                          className="flex-1 px-3 py-2 text-xs rounded border transition hover:bg-secondary"
                          style={{
                            borderColor: "var(--border)",
                            color: "var(--fg)",
                          }}
                        >
                          ✏️ Edit
                        </button>
                        <button
                          onClick={() => deleteQuestion(question._id)}
                          className="flex-1 px-3 py-2 text-xs rounded border border-red-300 text-red-600 transition hover:bg-red-50"
                        >
                          🗑️ Delete
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
