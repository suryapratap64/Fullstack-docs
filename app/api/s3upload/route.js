import { NextResponse } from "next/server";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

// Validate environment variables at startup
const requiredEnvVars = [
  "AWS_ACCESS_KEY_ID",
  "AWS_SECRET_ACCESS_KEY",
  "AWS_REGION",
  "AWS_BUCKET_NAME",
];

const missingEnvVars = requiredEnvVars.filter((env) => !process.env[env]);
if (missingEnvVars.length > 0) {
  console.warn("⚠️ Missing AWS environment variables:", missingEnvVars);
}

// Log credentials status (without showing actual values)
console.log("🔑 AWS Credentials Status:");
console.log(
  "  - Access Key ID:",
  process.env.AWS_ACCESS_KEY_ID ? "✓ Set" : "✗ Missing"
);
console.log(
  "  - Secret Key:",
  process.env.AWS_SECRET_ACCESS_KEY ? "✓ Set" : "✗ Missing"
);
console.log("  - Region:", process.env.AWS_REGION ? "✓ Set" : "✗ Missing");
console.log("  - Bucket:", process.env.AWS_BUCKET_NAME ? "✓ Set" : "✗ Missing");

const s3Client = new S3Client({
  region: process.env.AWS_REGION || "us-east-1",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || "",
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || "",
  },
});

export async function POST(req) {
  try {
    // Validate all required credentials
    if (!process.env.AWS_ACCESS_KEY_ID) {
      return NextResponse.json(
        { error: "Configuration error: AWS_ACCESS_KEY_ID not set" },
        { status: 500 }
      );
    }

    if (!process.env.AWS_SECRET_ACCESS_KEY) {
      return NextResponse.json(
        { error: "Configuration error: AWS_SECRET_ACCESS_KEY not set" },
        { status: 500 }
      );
    }

    if (!process.env.AWS_BUCKET_NAME) {
      return NextResponse.json(
        { error: "Configuration error: AWS_BUCKET_NAME not set" },
        { status: 500 }
      );
    }

    const formData = await req.formData();
    const file = formData.get("file");

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const fileName = file.name.replace(/[^a-zA-Z0-9.-]/g, "_"); // Sanitize filename
    const key = `uploads/${Date.now()}-${fileName}`;

    console.log(
      `📤 Uploading file: ${fileName} to S3 bucket: ${process.env.AWS_BUCKET_NAME}`
    );

    const command = new PutObjectCommand({
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: key,
      Body: buffer,
      ContentType: file.type,
    });

    const result = await s3Client.send(command);
    console.log("✅ File uploaded successfully to S3");

    // Generate S3 URL
    const fileUrl = `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`;

    return NextResponse.json({
      url: fileUrl,
      message: "File uploaded successfully",
      key: key,
    });
  } catch (error) {
    console.error("S3 Upload Error:", error);
    return NextResponse.json(
      {
        error: "Upload Failed",
        details: error.message,
        code: error.code,
      },
      { status: 500 }
    );
  }
}
