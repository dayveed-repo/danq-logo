"use client";
import { useUser } from "@clerk/nextjs";
import React, { createContext, useEffect, useState } from "react";

export const UserContext = createContext<any>(null);

const Provider = ({ children }: { children: React.ReactNode }) => {
  const { user } = useUser();
  const [userDetail, setuserDetail] = useState<any>(null);

  const checkUser = async () => {
    const response = await fetch(`/api/users`, {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({
        userName: user?.fullName || "",
        userEmail: user?.primaryEmailAddress?.emailAddress || "",
      }),
    });

    const jsonData = await response.json();
    setuserDetail(jsonData);
  };

  useEffect(() => {
    if (user && user?.id) {
      checkUser();
    }
  }, [user?.id]);

  return (
    <UserContext.Provider value={{ userDetail, setuserDetail }}>
      {children}
    </UserContext.Provider>
  );
};

export default Provider;
