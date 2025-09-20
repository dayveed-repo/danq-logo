"use client";
import Link from "next/link";
import React, { useState } from "react";

const HeroForm = () => {
  const [companyName, setcompanyName] = useState("");

  return (
    <div className="flex items-center w-full space-x-4">
      <input
        value={companyName}
        onChange={(e) => setcompanyName(e.target.value)}
        className="h-[50px] flex-1 outline-[0] outline-[var(--base-color)] focus-within:outline-[2px] bg-white text-base shadow-md rounded-lg px-4"
        placeholder="Enter Business Name"
      />

      <Link
        className="base-button h-[50px]"
        href={
          !companyName
            ? `/create?step=1`
            : ` /create?step=2&companyName=${companyName}`
        }
      >
        Generate Logo
      </Link>
    </div>
  );
};

export default HeroForm;
