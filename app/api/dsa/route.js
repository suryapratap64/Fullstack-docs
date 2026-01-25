import connectDB from "../../../config/db";
import DSA from "../../../models/dsa";
import { verifyToken } from "../../../utils/jwt";

export async function GET(req) {
  try {
    await connectDB();
    const token = req.cookies.get("token")?.value;
    if (!token)
      return Response.json({ error: "Unauthorized" }, { status: 401 });

    const user = verifyToken(token);
    if (!user)
      return Response.json({ error: "Invalid token" }, { status: 401 });

    const dsa = await DSA.find({ userId: user.id }).sort({ createdAt: 1 });
    return Response.json(dsa);
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    await connectDB();
    const token = req.cookies.get("token")?.value;
    if (!token)
      return Response.json({ error: "Unauthorized" }, { status: 401 });

    const user = verifyToken(token);
    if (!user)
      return Response.json({ error: "Invalid token" }, { status: 401 });

    const body = await req.json();
    const dsa = new DSA({ ...body, userId: user.id });
    await dsa.save();
    return Response.json(dsa);
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(req) {
  try {
    await connectDB();
    const { dsaId, ...body } = await req.json();
    const dsa = await DSA.findByIdAndUpdate(dsaId, body, { new: true });
    return Response.json(dsa);
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(req) {
  try {
    await connectDB();
    const { dsaId } = await req.json();
    await DSA.findByIdAndDelete(dsaId);
    return Response.json({ message: "Deleted" });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}
