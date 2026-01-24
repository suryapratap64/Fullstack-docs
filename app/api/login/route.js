import User from "../../../models/user";
import connectDB from "../../../config/db";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

const JWT_SECRET = process.env.JWT_SECRET || "your_secret_key";

export async function POST(request) {
  try {
    await connectDB();

    const { email, password } = await request.json();

    if (!email || !password) {
      return Response.json(
        { message: "Email and password are required" },
        { status: 400 },
      );
    }

    const user = await User.findOne({ email });
    if (!user) {
      return Response.json(
        { message: "Invalid email or password" },
        { status: 401 },
      );
    }

    // Compare hashed password using bcrypt
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return new Response(
        JSON.stringify({ message: "Invalid email or password" }),
        {
          status: 401,
          headers: { "Content-Type": "application/json" },
        },
      );
    }

    const token = jwt.sign({ id: user._id, email: user.email }, JWT_SECRET, {
      expiresIn: "1d",
    });

    // set cookie (SameSite=Lax so it works for same-site requests)
    return new Response(JSON.stringify({ message: "Login successful" }), {
      status: 200,
      headers: {
        "Set-Cookie": `token=${token}; HttpOnly; Path=/; Max-Age=604800; SameSite=Lax`, // 7 days
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    return Response.json({ message: "Server error" }, { status: 500 });
  }
}
