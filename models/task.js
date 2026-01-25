import mongoose from "mongoose";

const taskSchema = new mongoose.Schema(
  {
    english: { type: String, required: true },
    meaning: { type: String, required: true },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true },
);

export default mongoose.models.Task || mongoose.model("Task", taskSchema);
