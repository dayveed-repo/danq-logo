import { blobToBase64 } from "@/app/utils/helpers";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { imageUrl } = await request.json();

    const textToImageResponse = await fetch(imageUrl);

    // ---- gets the blob and converts to base64 ---
    const imageBlob = await textToImageResponse.blob();
    const imageBase64 = await blobToBase64(imageBlob);

    if (!imageBase64) {
      return NextResponse.json(
        { error: "Failed to initiate download" },
        { status: 422 }
      );
    }

    return NextResponse.json(
      {
        imageBase64,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Internal Error:", error);
    // Handle other errors (e.g., network issues, parsing errors)
    return NextResponse.json(
      { error: `Internal Server Error: ${error}` },
      { status: 500 }
    );
  }
}
