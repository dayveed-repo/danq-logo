import { db } from "@/config/firebaseConfig";
import { collection, getDocs, query, where } from "firebase/firestore";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const params = request.nextUrl.searchParams || {};

    const userEmail = params.get("userEmail") || "";

    if (!userEmail) {
      return NextResponse.json(
        {
          error: "User email is required",
        },
        { status: 401 }
      );
    }

    const q = query(
      collection(db, "danqLogosData"),
      where("userEmail", "==", userEmail)
    );

    const results = await getDocs(q);

    if (!results || !results.docs) {
      return NextResponse.json(
        {
          error: "Failed to fetch docs",
        },
        { status: 404 }
      );
    }

    let logos: any[] = [];

    results.forEach((doc) => {
      logos = [
        ...logos,
        {
          id: doc.id,
          ...(doc.data() || {}),
        },
      ];
    });

    return NextResponse.json(
      {
        logos,
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
