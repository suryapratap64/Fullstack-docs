import mongoose from "mongoose";

const postSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  content: {
    type: String,
  },
  category: {
    type: String,
    enum: ["Learning", "Project", "Bug Fix", "Research", "Implementation"],
    default: "Learning",
  },
  difficulty: {
    type: String,
    enum: ["Beginner", "Intermediate", "Advanced"],
    default: "Intermediate",
  },
  tags: [String],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const gptMonthSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    month: {
      type: Number,
      required: true,
      min: 1,
      max: 12,
    },
    year: {
      type: Number,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    summary: {
      type: String,
    },
    aiGenerated: {
      type: Boolean,
      default: false,
    },
    posts: [postSchema],
    stats: {
      totalLearnings: {
        type: Number,
        default: 0,
      },
      projectsCompleted: {
        type: Number,
        default: 0,
      },
      bugsFixed: {
        type: Number,
        default: 0,
      },
      averageDifficulty: {
        type: String,
        default: "Intermediate",
      },
    },
    images: [String],
    isFavorite: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
);

const GptMonth =
  mongoose.models.GptMonth || mongoose.model("GptMonth", gptMonthSchema);

export default GptMonth;
