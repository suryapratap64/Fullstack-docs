"use client";

import { useEffect, useState } from "react";
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

export default function DSAPage() {
  const router = useRouter();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch("/api/me");
        if (res.ok) {
          const data = await res.json();
          setUser(data);
        } else {
          router.push("/login");
        }
      } catch (err) {
        router.push("/login");
      }
    };
    checkAuth();
  }, [router]);

  if (!user)
    return <div className="w-full px-4 py-6 text-center">Loading...</div>;

  return (
    <div
      className="w-full min-h-screen"
      style={{ backgroundColor: "var(--bg)" }}
    >
      <div className="px-6 sm:px-8 py-8 w-full">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl sm:text-4xl font-bold mb-2 text-fg">
            DSA Revision
          </h1>
          <p className="text-fg-secondary text-sm sm:text-base">
            Master Data Structures & Algorithms
          </p>
        </div>

        {/* Add New Button & Editor */}
        <div className="flex justify-end gap-3 mb-6 flex-wrap">
          <button
            onClick={() => router.push("/dsa/editor")}
            className="px-6 py-3 rounded-lg text-sm font-medium transition hover:shadow-lg border"
            style={{
              backgroundColor: "transparent",
              borderColor: "var(--primary)",
              color: "var(--primary)",
            }}
          >
            💻 Code Editor
          </button>
          <button
            onClick={() => router.push("/dsa/upload")}
            className="px-6 py-3 btn-primary rounded-lg text-sm font-medium transition hover:shadow-lg "
          >
            + Add New Question
          </button>
        </div>

        {/* Chapters Grid */}
        <div className="grid grid-cols-1 ">
          {CHAPTERS.map((chapter) => {
            const slug = chapter.name
              .toLowerCase()
              .replace(/[^\w\s-]/g, "")
              .replace(/\s+/g, "-");
            const progress = Math.round(
              (chapter.problems / chapter.total) * 100
            );
            return (
              <div
                key={chapter.name}
                onClick={() => router.push(`/dsa/chapter/${slug}`)}
                className="p-6 bg-card  border shadow-sm cursor-pointer transition hover:bg-gray-800"
                style={{ borderColor: "var(--border)" }}
              >
                <h2 className="text-sm sm:text-base font-semibold text-fg mb-3">
                  {chapter.name}
                </h2>

                {/* Progress Bar */}
                <div className="mb-3">
                  <div
                    className="w-full h-2 bg-secondary rounded-full overflow-hidden"
                    style={{ backgroundColor: "var(--bg-secondary)" }}
                  >
                    <div
                      className="h-full rounded-full transition-all duration-300"
                      style={{
                        width: `${progress}%`,
                        backgroundColor:
                          progress === 100 ? "#10b981" : "var(--primary)",
                      }}
                    />
                  </div>
                </div>

                {/* Stats */}
                <div className="flex items-center justify-between">
                  <p className="text-xs text-fg-secondary">
                    {chapter.problems} / {chapter.total} problems
                  </p>
                  <span
                    className="text-xs font-bold px-2 py-1 rounded"
                    style={{
                      backgroundColor:
                        progress === 100 ? "#d1fae5" : "var(--bg-secondary)",
                      color:
                        progress === 100 ? "#065f46" : "var(--fg-secondary)",
                    }}
                  >
                    {progress}%
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
