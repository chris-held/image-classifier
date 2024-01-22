import { classifyImageStream } from "@/app/lib/classifier";
import { NextResponse, NextRequest } from "next/server";
import { StreamingTextResponse } from "ai";

// Set the runtime to edge for best performance
export const runtime = "edge";

export async function POST(request: NextRequest) {
  const data = await request.formData();
  const file: File | null = data.get("file") as unknown as File;

  if (!file) {
    return NextResponse.json(
      { message: "File not present in body" },
      { status: 400, statusText: "Bad Request" }
    );
  }

  const response = await classifyImageStream(file);
  return new StreamingTextResponse(response);
}
