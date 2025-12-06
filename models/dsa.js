import mongoose from "mongoose";

const dsaSchema = new mongoose.Schema(
  {
    chapter: String,
    title: String,
    difficulty: {
      type: String,
      enum: ["Easy", "Medium", "Hard"],
      default: "Medium",
    },
    problemStatement: String,
    solution: String,
    code: String,
    codeLanguage: { type: String, default: "javascript" },
    tags: [String],
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

const DSA = mongoose.models.DSA || mongoose.model("DSA", dsaSchema);
export default DSA;
