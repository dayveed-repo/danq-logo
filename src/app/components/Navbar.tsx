import React from "react";
import Logo from "./Logo";
import Link from "next/link";
import { currentUser } from "@clerk/nextjs/server";
import { UserButton } from "@clerk/nextjs";

const Navbar = async () => {
  const user = await currentUser();

  return (
    <div className="w-full py-4 flex">
      <div className="flex justify-between max-w-[90%] md:max-w-[85%] mx-auto w-full">
        <Logo />

        {user && user?.id ? (
          <div className="flex items-center space-x-3">
            <Link className="base-outline-btn" href="/dashboard">
              Dashboard
            </Link>

            <UserButton />
          </div>
        ) : (
          <Link className="base-outline-btn" href="/dashboard">
            Dashboard
          </Link>
        )}
      </div>
    </div>
  );
};

export default Navbar;
