import GptMonth from "../../../../models/gptMonth";
import connectDB from "../../../../config/db";
import { verifyToken } from "../../../../utils/jwt";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    await connectDB();
    const token = req.cookies.get("token")?.value;
    if (!token)
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const { id } = verifyToken(token);
    const { monthId, post } = await req.json();

    const gptMonth = await GptMonth.findOne({ _id: monthId, userId: id });
    if (!gptMonth) {
      return NextResponse.json({ message: "Month not found" }, { status: 404 });
    }

    gptMonth.posts.push(post);
    await gptMonth.save();

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
    const { monthId, postId, updatedPost } = await req.json();

    const gptMonth = await GptMonth.findOne({ _id: monthId, userId: id });
    if (!gptMonth) {
      return NextResponse.json({ message: "Month not found" }, { status: 404 });
    }

    const postIndex = gptMonth.posts.findIndex(
      (p) => p._id.toString() === postId,
    );
    if (postIndex === -1) {
      return NextResponse.json({ message: "Post not found" }, { status: 404 });
    }

    gptMonth.posts[postIndex] = {
      ...gptMonth.posts[postIndex],
      ...updatedPost,
    };
    await gptMonth.save();

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
    const monthId = searchParams.get("monthId");
    const postId = searchParams.get("postId");

    const gptMonth = await GptMonth.findOne({ _id: monthId, userId: id });
    if (!gptMonth) {
      return NextResponse.json({ message: "Month not found" }, { status: 404 });
    }

    gptMonth.posts = gptMonth.posts.filter((p) => p._id.toString() !== postId);
    await gptMonth.save();

    return NextResponse.json(gptMonth);
  } catch (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
