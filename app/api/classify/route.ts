import { classifyImage } from "@/app/lib/classifier";
import { NextResponse, NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  const data = await request.formData();
  const file: File | null = data.get("file") as unknown as File;

  if (!file) {
    return NextResponse.json(
      { message: "File not present in body" },
      { status: 400, statusText: "Bad Request" }
    );
  }

  const response = await classifyImage(file);
  try {
    return NextResponse.json({ response });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Unable to classify image" },
      { status: 500, statusText: "Internal Server Error" }
    );
  }
}
