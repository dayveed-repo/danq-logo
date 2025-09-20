import { db } from "@/config/firebaseConfig";
import { doc, getDoc } from "firebase/firestore";

export const validateUserCredits = async (userEmail: string) => {
  if (!userEmail) {
    return {
      error: "User email is missing for credit validation",
      success: false,
    };
  }

  const docRef = doc(db, "danqLogoUsers", userEmail);
  const docSnap = await getDoc(docRef);

  if (!docSnap.exists()) {
    return { error: "Failed to find user credential", success: false };
  }

  const userData = docSnap.data() || {};

  if (!userData || !userData?.numOfCredits) {
    return { error: "Insufficient Credits", success: false };
  }

  return { success: true, numOfCredits: userData?.numOfCredits || 0 };
};
