import { NextResponse } from "next/server";
import { verifyToken } from "../../../../utils/jwt";
import GptMonth from "../../../../models/gptMonth";
import connectDB from "../../../../config/db";

export async function POST(req) {
  try {
    await connectDB();
    const token = req.cookies.get("token")?.value;
    if (!token)
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const { id } = verifyToken(token);
    const { monthId, posts } = await req.json();

    // Call to Gemini API to generate summary
    const prompt = `Based on the following learning posts, create a comprehensive monthly summary. Posts: ${JSON.stringify(posts)}`;

    const response = await fetch(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-goog-api-key": process.env.GEMINI_API_KEY,
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: prompt,
                },
              ],
            },
          ],
        }),
      },
    );

    const data = await response.json();
    const summary = data.candidates[0].content.parts[0].text;

    // Update the month with AI-generated summary
    const gptMonth = await GptMonth.findOneAndUpdate(
      { _id: monthId, userId: id },
      { summary, aiGenerated: true },
      { new: true },
    );

    return NextResponse.json({ summary, gptMonth });
  } catch (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
