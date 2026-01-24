import GptMonth from "../../../models/gptMonth";
import connectDB from "../../../config/db";
import { verifyToken } from "../../../utils/jwt";
import { NextResponse } from "next/server";

export async function GET(req) {
  try {
    await connectDB();
    const token = req.cookies.get("token")?.value;
    if (!token)
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const { id } = verifyToken(token);
    const gptMonths = await GptMonth.find({ userId: id }).sort({
      year: -1,
      month: -1,
    });
    return NextResponse.json(gptMonths);
  } catch (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    await connectDB();
    const token = req.cookies.get("token")?.value;
    if (!token)
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const { id } = verifyToken(token);
    const { month, year, title, summary, posts, aiGenerated } =
      await req.json();

    const existing = await GptMonth.findOne({ userId: id, month, year });
    if (existing) {
      return NextResponse.json(
        { message: "Month already exists" },
        { status: 400 },
      );
    }

    const gptMonth = await GptMonth.create({
      userId: id,
      month,
      year,
      title,
      summary,
      posts: posts || [],
      aiGenerated: aiGenerated || false,
    });

    return NextResponse.json(gptMonth, { status: 201 });
  } catch (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

export async function PUT(req) {
  try {
    await connectDB();
    const token = req.cookies.get("token")?.value;
    if (!token)
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const { id } = verifyToken(token);
    const { searchParams } = new URL(req.url);
    const monthId = searchParams.get("id");

    const { title, summary, posts, isFavorite, stats } = await req.json();

    const gptMonth = await GptMonth.findOneAndUpdate(
      { _id: monthId, userId: id },
      { title, summary, posts, isFavorite, stats },
      { new: true },
    );

    if (!gptMonth) {
      return NextResponse.json({ message: "Not found" }, { status: 404 });
    }

    return NextResponse.json(gptMonth);
  } catch (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

export async function DELETE(req) {
  try {
    await connectDB();
    const token = req.cookies.get("token")?.value;
    if (!token)
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const { id } = verifyToken(token);
    const { searchParams } = new URL(req.url);
    const monthId = searchParams.get("id");

    const gptMonth = await GptMonth.findOneAndDelete({
      _id: monthId,
      userId: id,
    });

    if (!gptMonth) {
      return NextResponse.json({ message: "Not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Deleted successfully" });
  } catch (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
