import { validateUserCredits } from "@/app/utils/validatePaidSubscription";
import { db, storageBucket } from "@/config/firebaseConfig";
import { doc, setDoc, updateDoc } from "firebase/firestore";
import { getDownloadURL, ref, uploadString } from "firebase/storage";
import { NextRequest, NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";

export async function POST(request: NextRequest) {
  try {
    const {
      type,
      imageBase64,
      title,
      description,
      colorTheme,
      design,
      prompt,
      userEmail,
    } = await request.json();

    if (
      !imageBase64 ||
      !title ||
      !description ||
      !colorTheme ||
      !userEmail ||
      !design ||
      !prompt
    ) {
      return NextResponse.json(
        { error: `Missing required parameters` },
        { status: 422 }
      );
    }

    const creditValidations = await validateUserCredits(userEmail);
    const credits = creditValidations.numOfCredits;

    let uniqueId = uuidv4();
    const firebaseBucketRef = ref(
      storageBucket,
      `danqLogos/${title.toLowerCase().replaceAll(" ", "_")}_${uniqueId}`
    );

    const uploadedImageRef = (
      await uploadString(firebaseBucketRef, imageBase64, "data_url")
    ).ref;
    const imageUrl = await getDownloadURL(uploadedImageRef);
    const logoId = uniqueId;

    const docRef = doc(db, "danqLogosData", logoId);
    await setDoc(docRef, {
      title,
      imageUrl,
      description,
      colorTheme,
      design,
      prompt,
      userEmail,
      createTimestmp: new Date().getTime(),
    });

    const userRef = doc(db, "danqLogoUsers", userEmail);

    if (credits && type.toLowerCase() === "premium") {
      await updateDoc(userRef, { numOfCredits: credits - 1 });
    }

    return NextResponse.json({ imageUrl, id: logoId }, { status: 200 });
  } catch (error) {
    console.error("Internal Error:", error);
    // Handle other errors (e.g., network issues, parsing errors)
    return NextResponse.json(
      { error: `Internal Server Error: ${error}` },
      { status: 500 }
    );
  }
}
