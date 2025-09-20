import { Suspense } from "react";
import CreateLogo from "./CreateLogo";

export default function CreatePage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <CreateLogo />
    </Suspense>
  );
}
