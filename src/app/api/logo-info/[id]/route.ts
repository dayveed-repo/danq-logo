import { db } from "@/config/firebaseConfig";
import { doc, getDoc } from "firebase/firestore";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    if (!params.id) {
      return NextResponse.json(
        {
          error: "Id is required",
        },
        { status: 401 }
      );
    }

    const docRef = doc(db, "danqLogosData", params.id);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
      return NextResponse.json(
        {
          error: "Logo not found",
        },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        logo: docSnap.data(),
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
