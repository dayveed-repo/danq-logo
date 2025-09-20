"use client";
import Lottie from "lottie-react";
import React from "react";
import loaderAnimaton from "../generate-logo-loader.json";

const Loading = () => {
  return (
    <div className="h-[30vh] w-full flex items-center justify-center">
      <Lottie animationData={loaderAnimaton} />
    </div>
  );
};

export default Loading;
