import { db } from "@/config/firebaseConfig";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { userEmail, userName } = await request.json();

    const docRef = doc(db, "danqLogoUsers", userEmail);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return NextResponse.json({ user: docSnap.data() }, { status: 200 });
    } else {
      // docSnap.data() will be undefined in this case
      const newDoc = {
        name: userName,
        email: userEmail,
        numOfCredits: 5,
      };
      await setDoc(doc(db, "danqLogoUsers", userEmail), newDoc);

      return NextResponse.json({ user: newDoc }, { status: 200 });
    }
  } catch (error) {
    console.error("Internal Error:", error);
    // Handle other errors (e.g., network issues, parsing errors)
    return NextResponse.json(
      { error: `Internal Server Error: ${error}` },
      { status: 500 }
    );
  }
}
