import User from "../../../models/user";
import connectDB from "../../../config/db";
import { verifyToken } from "../../../utils/jwt";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    await connectDB();

    // parse request body once
    const body = await req.json();
    const { email, currentPassword, newPassword } = body || {};

    if (!currentPassword || !newPassword) {
      return NextResponse.json(
        { message: "Both current and new password are required" },
        { status: 400 }
      );
    }

    // Try to get token from cookie or Authorization header
    let token;
    try {
      token = req.cookies?.get?.('token')?.value;
      if (!token) {
        const auth = req.headers.get('authorization');
        if (auth && auth.startsWith('Bearer ')) token = auth.split(' ')[1];
      }
    } catch (e) {
      token = undefined;
    }

    // debug log token/email presence (do not log full token in production)
    try {
      console.log(
        '[change-password] tokenPresent=', !!token,
        'emailProvided=', !!email
      );
    } catch (e) {
      /* ignore logging errors */
    }

    let user = null;
    if (token) {
      try {
        const payload = verifyToken(token);
        user = await User.findById(payload.id);
      } catch (e) {
        // invalid token -> ignore and fallback to email
        user = null;
      }
    }

    // Fallback to email lookup if token not provided or invalid
    if (!user && email) {
      user = await User.findOne({ email });
    }

    if (!user) {
      console.log(
        '[change-password] user lookup failed, tokenPresent=', !!token,
        'emailProvided=', !!email
      );
      // If neither token nor email provided, return a clearer 400 so the client
      // knows that authentication or an email is required.
      if (!token && !email) {
        return NextResponse.json(
          { message: 'No auth token and no email provided. Log in or provide email in the form.' },
          { status: 400 }
        );
      }

      return NextResponse.json(
        { message: "User not found - provide a valid email or login first" },
        { status: 404 }
      );
    }

    const match = await bcrypt.compare(currentPassword, user.password);
    if (!match)
      return NextResponse.json(
        { message: "Current password is incorrect" },
        { status: 401 }
      );

    const hashed = await bcrypt.hash(newPassword, 10);
    user.password = hashed;
    await user.save();

    return NextResponse.json({ message: "Password changed successfully" });
  } catch (err) {
    console.error("Change password error:", err);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
