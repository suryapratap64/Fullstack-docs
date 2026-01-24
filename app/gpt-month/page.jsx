"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  FaPlus,
  FaTrash,
  FaEdit,
  FaHeart,
  FaRegHeart,
  FaStar,
  FaSync,
  FaCalendar,
} from "react-icons/fa";

const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];
const CATEGORIES = [
  "Learning",
  "Project",
  "Bug Fix",
  "Research",
  "Implementation",
];
const DIFFICULTIES = ["Beginner", "Intermediate", "Advanced"];

export default function GptMonthPage() {
  const router = useRouter();
  const [gptMonths, setGptMonths] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedMonth, setSelectedMonth] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showPostModal, setShowPostModal] = useState(false);
  const [editingPost, setEditingPost] = useState(null);
  const [currentYear] = useState(new Date().getFullYear());
  const [currentMonthNum] = useState(new Date().getMonth() + 1);

  const [formData, setFormData] = useState({
    month: currentMonthNum,
    year: currentYear,
    title: "",
    summary: "",
  });

  const [postData, setPostData] = useState({
    title: "",
    description: "",
    content: "",
    category: "Learning",
    difficulty: "Intermediate",
    tags: "",
  });

  // Fetch all gpt months
  const fetchGptMonths = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/gpt-month");
      const data = await res.json();
      if (res.ok) {
        setGptMonths(data);
      }
    } catch (error) {
      toast.error("Failed to fetch months");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGptMonths();
  }, []);

  // Create new month
  const handleCreateMonth = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/gpt-month", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      setGptMonths([data, ...gptMonths]);
      setShowCreateModal(false);
      setFormData({
        month: currentMonthNum,
        year: currentYear,
        title: "",
        summary: "",
      });
      toast.success("Month created successfully");
    } catch (error) {
      toast.error(error.message);
      console.error(error);
    }
  };

  // Add post to month
  const handleAddPost = async (e) => {
    e.preventDefault();
    if (!selectedMonth) {
      toast.error("Select a month first");
      return;
    }

    try {
      const newPost = {
        ...postData,
        tags: postData.tags
          .split(",")
          .map((tag) => tag.trim())
          .filter((tag) => tag),
      };

      let updatedMonth = { ...selectedMonth };

      if (editingPost) {
        updatedMonth.posts = updatedMonth.posts.map((p) =>
          p._id === editingPost._id ? { ...p, ...newPost } : p,
        );
      } else {
        updatedMonth.posts = [...(updatedMonth.posts || []), newPost];
      }

      const res = await fetch("/api/gpt-month?id=" + selectedMonth._id, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(updatedMonth),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      setGptMonths(
        gptMonths.map((m) => (m._id === selectedMonth._id ? data : m)),
      );
      setSelectedMonth(data);
      setShowPostModal(false);
      setPostData({
        title: "",
        description: "",
        content: "",
        category: "Learning",
        difficulty: "Intermediate",
        tags: "",
      });
      setEditingPost(null);
      toast.success(editingPost ? "Post updated" : "Post added successfully");
    } catch (error) {
      toast.error(error.message);
      console.error(error);
    }
  };

  // Delete month
  const handleDeleteMonth = async (monthId) => {
    if (!confirm("Are you sure?")) return;

    try {
      const res = await fetch("/api/gpt-month?id=" + monthId, {
        method: "DELETE",
        credentials: "include",
      });

      if (!res.ok) throw new Error("Failed to delete");

      setGptMonths(gptMonths.filter((m) => m._id !== monthId));
      setSelectedMonth(null);
      toast.success("Month deleted");
    } catch (error) {
      toast.error(error.message);
    }
  };

  // Delete post
  const handleDeletePost = async (postId) => {
    if (!selectedMonth || !confirm("Delete this post?")) return;

    try {
      const updatedMonth = {
        ...selectedMonth,
        posts: selectedMonth.posts.filter((p) => p._id !== postId),
      };

      const res = await fetch("/api/gpt-month?id=" + selectedMonth._id, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(updatedMonth),
      });

      const data = await res.json();
      if (!res.ok) throw new Error("Failed to delete post");

      setGptMonths(
        gptMonths.map((m) => (m._id === selectedMonth._id ? data : m)),
      );
      setSelectedMonth(data);
      toast.success("Post deleted");
    } catch (error) {
      toast.error(error.message);
    }
  };

  // Toggle favorite
  const handleToggleFavorite = async (monthId) => {
    const month = gptMonths.find((m) => m._id === monthId);
    try {
      const res = await fetch("/api/gpt-month?id=" + monthId, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ ...month, isFavorite: !month.isFavorite }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error("Failed to update");

      setGptMonths(gptMonths.map((m) => (m._id === monthId ? data : m)));
      if (selectedMonth?._id === monthId) setSelectedMonth(data);
      toast.success("Updated");
    } catch (error) {
      toast.error(error.message);
    }
  };

  // Generate AI summary
  const handleGenerateSummary = async () => {
    if (!selectedMonth?.posts?.length) {
      toast.error("Add posts first");
      return;
    }

    try {
      const res = await fetch("/api/gpt-month/summarize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          monthId: selectedMonth._id,
          posts: selectedMonth.posts,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      setGptMonths(
        gptMonths.map((m) => (m._id === selectedMonth._id ? data.gptMonth : m)),
      );
      setSelectedMonth(data.gptMonth);
      toast.success("AI summary generated");
    } catch (error) {
      toast.error(error.message);
      console.error(error);
    }
  };

  if (loading) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ background: "var(--bg)" }}
      >
        <p style={{ color: "var(--fg)" }}>Loading...</p>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen p-4 md:p-8"
      style={{ background: "var(--bg)" }}
    >
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1
            className="text-4xl font-bold mb-2"
            style={{ color: "var(--primary)" }}
          >
            📚 GPT Month Learning Tracker
          </h1>
          <p style={{ color: "var(--fg-secondary)" }}>
            Track your monthly learning journey with AI-powered summaries
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Sidebar - Month List */}
          <div className="lg:col-span-1">
            <div
              className="card rounded-lg p-4 border"
              style={{ background: "var(--card-bg)" }}
            >
              <div className="flex items-center justify-between mb-4">
                <h2
                  className="text-lg font-bold"
                  style={{ color: "var(--primary)" }}
                >
                  Months
                </h2>
                <button
                  onClick={() => setShowCreateModal(true)}
                  className="btn-primary p-2 rounded-lg flex items-center gap-2 text-xs"
                >
                  <FaPlus /> New
                </button>
              </div>

              <div className="space-y-2 max-h-[70vh] overflow-y-auto">
                {gptMonths.length === 0 ? (
                  <p
                    style={{ color: "var(--fg-secondary)" }}
                    className="text-sm"
                  >
                    No months yet. Create one!
                  </p>
                ) : (
                  gptMonths.map((month) => (
                    <div
                      key={month._id}
                      onClick={() => setSelectedMonth(month)}
                      className={`p-3 rounded-lg cursor-pointer transition border ${
                        selectedMonth?._id === month._id
                          ? "border-primary"
                          : "border-transparent hover:border-primary"
                      }`}
                      style={{
                        background:
                          selectedMonth?._id === month._id
                            ? "rgba(var(--primary-rgb), 0.1)"
                            : "var(--bg)",
                      }}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span
                          className="font-semibold text-sm"
                          style={{ color: "var(--fg)" }}
                        >
                          {MONTHS[month.month - 1]} {month.year}
                        </span>
                        {month.isFavorite && (
                          <FaStar className="text-yellow-500" size={12} />
                        )}
                      </div>
                      <p
                        style={{ color: "var(--fg-secondary)" }}
                        className="text-xs truncate"
                      >
                        {month.title}
                      </p>
                      <div className="flex gap-1 mt-2 text-xs">
                        <span className="badge bg-blue-500/20 text-blue-400 px-2 py-1 rounded">
                          {month.posts?.length || 0} posts
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Right Content - Month Details */}
          <div className="lg:col-span-2">
            {selectedMonth ? (
              <div
                className="card rounded-lg p-6 border"
                style={{ background: "var(--card-bg)" }}
              >
                {/* Month Header */}
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <h2
                      className="text-3xl font-bold mb-2"
                      style={{ color: "var(--primary)" }}
                    >
                      {MONTHS[selectedMonth.month - 1]} {selectedMonth.year}
                    </h2>
                    <p
                      className="text-lg font-semibold"
                      style={{ color: "var(--fg)" }}
                    >
                      {selectedMonth.title}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleToggleFavorite(selectedMonth._id)}
                      className="p-2 rounded-lg transition"
                      style={{
                        background: "var(--bg)",
                        color: selectedMonth.isFavorite
                          ? "var(--primary)"
                          : "var(--fg-secondary)",
                      }}
                    >
                      {selectedMonth.isFavorite ? <FaHeart /> : <FaRegHeart />}
                    </button>
                    {/* <button
                      onClick={() => handleDeleteMonth(selectedMonth._id)}
                      className="p-2 rounded-lg transition"
                      style={{ background: "var(--bg)" }}
                    >
                      <FaTrash style={{ color: "var(--danger)" }} />
                    </button> */}
                  </div>
                </div>

                {/* Summary Section */}
                {selectedMonth.summary && (
                  <div
                    className="mb-6 p-4 rounded-lg"
                    style={{ background: "var(--bg)" }}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h3
                        className="font-semibold flex items-center gap-2"
                        style={{ color: "var(--primary)" }}
                      >
                        ✨ AI Summary{" "}
                        {selectedMonth.aiGenerated && "(AI Generated)"}
                      </h3>
                    </div>
                    <p
                      style={{ color: "var(--fg-secondary)" }}
                      className="text-sm leading-relaxed"
                    >
                      {selectedMonth.summary}
                    </p>
                  </div>
                )}

                {/* Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
                  <div
                    className="p-3 rounded-lg"
                    style={{ background: "var(--bg)" }}
                  >
                    <p
                      style={{ color: "var(--fg-secondary)" }}
                      className="text-xs"
                    >
                      Total Posts
                    </p>
                    <p
                      className="text-2xl font-bold"
                      style={{ color: "var(--primary)" }}
                    >
                      {selectedMonth.posts?.length || 0}
                    </p>
                  </div>
                  <div
                    className="p-3 rounded-lg"
                    style={{ background: "var(--bg)" }}
                  >
                    <p
                      style={{ color: "var(--fg-secondary)" }}
                      className="text-xs"
                    >
                      Learning
                    </p>
                    <p
                      className="text-2xl font-bold"
                      style={{ color: "var(--primary)" }}
                    >
                      {selectedMonth.posts?.filter(
                        (p) => p.category === "Learning",
                      ).length || 0}
                    </p>
                  </div>
                  <div
                    className="p-3 rounded-lg"
                    style={{ background: "var(--bg)" }}
                  >
                    <p
                      style={{ color: "var(--fg-secondary)" }}
                      className="text-xs"
                    >
                      Projects
                    </p>
                    <p
                      className="text-2xl font-bold"
                      style={{ color: "var(--primary)" }}
                    >
                      {selectedMonth.posts?.filter(
                        (p) => p.category === "Project",
                      ).length || 0}
                    </p>
                  </div>
                  <div
                    className="p-3 rounded-lg"
                    style={{ background: "var(--bg)" }}
                  >
                    <p
                      style={{ color: "var(--fg-secondary)" }}
                      className="text-xs"
                    >
                      Bugs Fixed
                    </p>
                    <p
                      className="text-2xl font-bold"
                      style={{ color: "var(--primary)" }}
                    >
                      {selectedMonth.posts?.filter(
                        (p) => p.category === "Bug Fix",
                      ).length || 0}
                    </p>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2 mb-6">
                  <button
                    onClick={() => {
                      setEditingPost(null);
                      setPostData({
                        title: "",
                        description: "",
                        content: "",
                        category: "Learning",
                        difficulty: "Intermediate",
                        tags: "",
                      });
                      setShowPostModal(true);
                    }}
                    className="btn-primary px-4 py-2 rounded-lg flex items-center gap-2 text-sm transition"
                  >
                    <FaPlus /> Add Post
                  </button>
                  <button
                    onClick={handleGenerateSummary}
                    className="btn-primary px-4 py-2 rounded-lg flex items-center gap-2 text-sm transition"
                    style={{
                      background: "var(--success-bg)",
                      color: "var(--success)",
                    }}
                  >
                    <FaSync /> Generate Summary
                  </button>
                </div>

                {/* Posts List */}
                <div>
                  <h3
                    className="text-lg font-bold mb-4"
                    style={{ color: "var(--primary)" }}
                  >
                    Posts
                  </h3>
                  {selectedMonth.posts?.length === 0 ? (
                    <p
                      style={{ color: "var(--fg-secondary)" }}
                      className="text-sm"
                    >
                      No posts yet. Add one to get started!
                    </p>
                  ) : (
                    <div className="space-y-3 max-h-[45vh] overflow-y-auto">
                      {selectedMonth.posts?.map((post, idx) => (
                        <div
                          key={post._id || idx}
                          className="p-4 rounded-lg border transition hover:border-primary"
                          style={{ background: "var(--bg)" }}
                        >
                          <div className="flex items-start justify-between mb-2">
                            <div>
                              <h4
                                className="font-bold"
                                style={{ color: "var(--fg)" }}
                              >
                                {post.title}
                              </h4>
                              <p
                                style={{ color: "var(--fg-secondary)" }}
                                className="text-sm"
                              >
                                {post.description}
                              </p>
                            </div>
                            <div className="flex gap-2">
                              <button
                                onClick={() => {
                                  setEditingPost(post);
                                  setPostData({
                                    title: post.title,
                                    description: post.description,
                                    content: post.content,
                                    category: post.category,
                                    difficulty: post.difficulty,
                                    tags: post.tags.join(", "),
                                  });
                                  setShowPostModal(true);
                                }}
                                className="text-blue-500 hover:text-blue-400"
                              >
                                <FaEdit size={14} />
                              </button>
                              {/* <button
                                onClick={() =>
                                  handleDeletePost(post._id || idx)
                                }
                                className="text-red-500 hover:text-red-400"
                              >
                                <FaTrash size={14} />
                              </button> */}
                            </div>
                          </div>
                          <div className="flex flex-wrap gap-2 items-center text-xs">
                            <span className="badge bg-purple-500/20 text-purple-400 px-2 py-1 rounded">
                              {post.category}
                            </span>
                            <span className="badge bg-orange-500/20 text-orange-400 px-2 py-1 rounded">
                              {post.difficulty}
                            </span>
                            {post.tags?.map((tag) => (
                              <span
                                key={tag}
                                className="badge bg-cyan-500/20 text-cyan-400 px-2 py-1 rounded"
                              >
                                #{tag}
                              </span>
                            ))}
                          </div>
                          {post.content && (
                            <p
                              style={{ color: "var(--fg-secondary)" }}
                              className="text-xs mt-2 line-clamp-2"
                            >
                              {post.content}
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div
                className="card rounded-lg p-12 border text-center"
                style={{ background: "var(--card-bg)" }}
              >
                <FaCalendar
                  className="mx-auto mb-4 text-4xl"
                  style={{ color: "var(--primary)" }}
                />
                <p style={{ color: "var(--fg-secondary)" }}>
                  Select a month to view details
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Create Month Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div
            className="card rounded-lg p-6 border max-w-md w-full"
            style={{ background: "var(--card-bg)" }}
          >
            <h3
              className="text-xl font-bold mb-4"
              style={{ color: "var(--primary)" }}
            >
              Create New Month
            </h3>
            <form onSubmit={handleCreateMonth} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <select
                  value={formData.month}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      month: parseInt(e.target.value),
                    })
                  }
                  className="input-card border rounded text-sm p-2 outline-none"
                  required
                >
                  {MONTHS.map((m, idx) => (
                    <option key={idx} value={idx + 1}>
                      {m}
                    </option>
                  ))}
                </select>
                <input
                  type="number"
                  value={formData.year}
                  onChange={(e) =>
                    setFormData({ ...formData, year: parseInt(e.target.value) })
                  }
                  className="input-card border rounded text-sm p-2 outline-none"
                  required
                />
              </div>
              <input
                type="text"
                placeholder="Month Title"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                className="input-card border rounded text-sm p-2 outline-none w-full"
                required
              />
              <textarea
                placeholder="Month Summary (optional)"
                value={formData.summary}
                onChange={(e) =>
                  setFormData({ ...formData, summary: e.target.value })
                }
                className="input-card border rounded text-sm p-2 outline-none w-full h-24 resize-none"
              />
              <div className="flex gap-2 pt-4">
                <button
                  type="submit"
                  className="btn-primary flex-1 py-2 rounded-lg font-semibold text-sm"
                >
                  Create
                </button>
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="flex-1 py-2 rounded-lg font-semibold text-sm border"
                  style={{ background: "var(--bg)", color: "var(--fg)" }}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add/Edit Post Modal */}
      {showPostModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 overflow-y-auto">
          <div
            className="card rounded-lg p-6 border max-w-2xl w-full my-6"
            style={{ background: "var(--card-bg)" }}
          >
            <h3
              className="text-xl font-bold mb-4"
              style={{ color: "var(--primary)" }}
            >
              {editingPost ? "Edit Post" : "Add New Post"}
            </h3>
            <form onSubmit={handleAddPost} className="space-y-4">
              <input
                type="text"
                placeholder="Post Title"
                value={postData.title}
                onChange={(e) =>
                  setPostData({ ...postData, title: e.target.value })
                }
                className="input-card border rounded text-sm p-2 outline-none w-full"
                required
              />
              <input
                type="text"
                placeholder="Description"
                value={postData.description}
                onChange={(e) =>
                  setPostData({ ...postData, description: e.target.value })
                }
                className="input-card border rounded text-sm p-2 outline-none w-full"
                required
              />
              <textarea
                placeholder="Content"
                value={postData.content}
                onChange={(e) =>
                  setPostData({ ...postData, content: e.target.value })
                }
                className="input-card border rounded text-sm p-2 outline-none w-full h-24 resize-none"
              />
              <div className="grid grid-cols-2 gap-3">
                <select
                  value={postData.category}
                  onChange={(e) =>
                    setPostData({ ...postData, category: e.target.value })
                  }
                  className="input-card border rounded text-sm p-2 outline-none"
                >
                  {CATEGORIES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
                <select
                  value={postData.difficulty}
                  onChange={(e) =>
                    setPostData({ ...postData, difficulty: e.target.value })
                  }
                  className="input-card border rounded text-sm p-2 outline-none"
                >
                  {DIFFICULTIES.map((d) => (
                    <option key={d} value={d}>
                      {d}
                    </option>
                  ))}
                </select>
              </div>
              <input
                type="text"
                placeholder="Tags (comma separated)"
                value={postData.tags}
                onChange={(e) =>
                  setPostData({ ...postData, tags: e.target.value })
                }
                className="input-card border rounded text-sm p-2 outline-none w-full"
              />
              <div className="flex gap-2 pt-4">
                <button
                  type="submit"
                  className="btn-primary flex-1 py-2 rounded-lg font-semibold text-sm"
                >
                  {editingPost ? "Update" : "Add"}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowPostModal(false);
                    setEditingPost(null);
                    setPostData({
                      title: "",
                      description: "",
                      content: "",
                      category: "Learning",
                      difficulty: "Intermediate",
                      tags: "",
                    });
                  }}
                  className="flex-1 py-2 rounded-lg font-semibold text-sm border"
                  style={{ background: "var(--bg)", color: "var(--fg)" }}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
