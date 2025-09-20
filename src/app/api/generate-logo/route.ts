import { blobToBase64 } from "@/app/utils/helpers";
import { validateUserCredits } from "@/app/utils/validatePaidSubscription";
import { DanqLogo } from "@/config/AIModels";
import { NextRequest, NextResponse } from "next/server";
import Replicate from "replicate";

const huggingfaceKey = process.env.HUGGING_FACE_ACCESS_TOKEN || "";
const replicateToken = process.env.REPLICATE_API_TOKEN || "";

export async function POST(request: NextRequest) {
  try {
    const { prompt, type, userEmail } = await request.json();

    if (!prompt)
      return NextResponse.json(
        { error: `Prompt is required` },
        { status: 422 }
      );

    const aiResponse = await DanqLogo.sendMessage(prompt);
    if (!aiResponse.response.text())
      return NextResponse.json(
        { error: "Failed to process logo prompt" },
        { status: 422 }
      );

    const parsedResponse = JSON.parse(aiResponse.response.text());
    const processedPrompt = parsedResponse?.prompt?.replace(/\\/g, "");
    let imageBase64 = "";

    if (type?.toLowerCase() === "free") {
      const textToImageResponse = await fetch(
        "https://api-inference.huggingface.co/models/black-forest-labs/FLUX.1-dev",
        {
          headers: {
            Authorization: `Bearer ${huggingfaceKey}`,
            "Content-Type": "application/json",
          },
          method: "POST",
          body: JSON.stringify({ inputs: processedPrompt }),
        }
      );

      // ---- gets the blob and converts to base64 ---
      const imageBlob = await textToImageResponse.blob();
      imageBase64 = await blobToBase64(imageBlob);
    } else if (type?.toLowerCase() === "premium") {
      const creditValidations = await validateUserCredits(userEmail);

      if (!creditValidations?.success) {
        return NextResponse.json(
          { error: creditValidations.error },
          { status: 401 }
        );
      }

      const replicate = new Replicate({
        auth: replicateToken,
        useFileOutput: false,
      });

      const imageOutPuts = await replicate.run(
        "bytedance/hyper-flux-8step:81946b1e09b256c543b35f37333a30d0d02ee2cd8c4f77cd915873a1ca622bad",
        {
          input: {
            prompt: processedPrompt,
            num_outputs: 1,
            aspect_ratio: "1:1",
            output_format: "png",
            guidance_scale: 3.5,
            output_quality: 80,
            num_inference_steps: 8,
            useFileOutput: false,
          },
        }
      );

      // @ts-ignore
      if (!imageOutPuts || !imageOutPuts?.length) {
        return NextResponse.json(
          { error: "Failed to generate image" },
          { status: 422 }
        );
      }

      const textToImageResponse = await fetch(
        // @ts-ignore
        imageOutPuts[0],
        {
          headers: {
            Authorization: `Bearer ${replicateToken}`,
            "Content-Type": "application/json",
          },
          method: "GET",
        }
      );

      // ---- gets the blob and converts to base64 ---
      const imageBlob = await textToImageResponse.blob();
      imageBase64 = await blobToBase64(imageBlob);
    }

    if (!imageBase64) {
      return NextResponse.json(
        { error: "Failed to process image" },
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
