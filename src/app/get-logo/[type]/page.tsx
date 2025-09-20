"use client";
import React, { useContext, useEffect, useState } from "react";
import prompts from "../../utils/prompts";
import { UserContext } from "../../provider";
import { useParams } from "next/navigation";
import { decrypt } from "@/app/utils/helpers";
import Loading from "@/app/components/GenerateLogoLoader";
import Link from "next/link";
import ErrorIcon from "@/app/components/ErrorIcon";
import { useRouter } from "next/navigation";

const GetLogo = () => {
  const { userDetail, setuserDetail } = useContext(UserContext);
  const [logoData, setlogoData] = useState<any>(null);
  const [loadingTrack, setloadingTrack] = useState("");
  // const [loadedImage, setLoadedImage] = useState("");
  const [error, seterror] = useState("");
  const [logoStatus, setlogoStatus] = useState("complete");

  const { type } = useParams<{ type: string }>();
  const router = useRouter();

  useEffect(() => {
    let logoData = localStorage.getItem("danqLogoData");

    if (logoData) {
      const parsedData = JSON.parse(logoData);
      setlogoData(parsedData);
    }
  }, [JSON.stringify(userDetail)]);

  useEffect(() => {
    if (logoData?.title && userDetail?.user?.email) {
      generateLogo();
    }
  }, [JSON.stringify(logoData), JSON.stringify(userDetail)]);

  const generateLogo = async () => {
    const plan = decrypt(decodeURIComponent(type || ""));

    setlogoStatus("loading");
    seterror("");
    if (!plan || !["free", "premium"].includes(plan?.toLowerCase())) {
      setlogoStatus("error");
      return seterror("Invalid Plan");
    }

    const prompt = prompts.LOGO_PROMPT.replace("{logoTitle}", logoData?.title)
      .replace("{logoDesc}", logoData?.description)
      .replace("{logoColor}", logoData?.colorTheme)
      .replace("{logoDesign}", logoData?.design)
      .replace("{logoPrompt}", logoData?.prompt);

    try {
      setloadingTrack(
        "Please wait while we bring your outstanding logo to life"
      );
      const response = await fetch("/api/generate-logo", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          prompt,
          type: plan,
          userEmail: userDetail?.user?.email,
        }),
      });

      const responseObj = await response.json();

      if (!responseObj || !responseObj?.imageBase64) {
        setlogoStatus("error");
        seterror("An error occured while generating logo");
        return setloadingTrack("");
      }

      setloadingTrack("It's almost ready, the logo is being saved...");
      const uploadresponse = await fetch("/api/upload-logo", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          imageBase64: responseObj?.imageBase64 || "",
          title: logoData.title,
          description: logoData.description,
          colorTheme: logoData.colorTheme,
          design: logoData.design,
          prompt,
          userEmail: userDetail?.user?.email,
          type: plan,
        }),
      });

      const uploadJson = await uploadresponse.json();

      if (!uploadJson || !uploadJson?.imageUrl) {
        setlogoStatus("error");
        seterror("An error occured while generating logo");
        return setloadingTrack("");
      }

      // setLoadedImage(uploadJson?.imageUrl || "");
      setloadingTrack("");
      // setlogoStatus("complete");
      seterror("");
      localStorage.removeItem("danqLogoData");
      return router.replace(`/logo/${uploadJson?.id}`);
    } catch (error) {
      setlogoStatus("error");
      seterror("An error occured while generating logo");
      setloadingTrack("");
      console.log(error);
    }
  };

  return (
    <div className="w-full py-[5%]">
      <div className="logo-detail-wrapper">
        <h2 className="text-[var(--base-color)] text-[1.5rem] leading-8 font-bold">
          {logoStatus === "loading"
            ? "Generating Logo"
            : logoStatus === "error"
            ? "Error Generating Logo"
            : ""}
        </h2>

        <p
          className={`text-medium text-[0.875rem] leading-5 ${"text-gray-500"} mt-2 mb-7 text-center`}
        >
          {logoStatus === "loading" ? loadingTrack : error}
        </p>

        {logoStatus === "loading" ? (
          <Loading />
        ) : logoStatus === "error" ? (
          <ErrorIcon />
        ) : (
          ""
        )}

        {logoStatus === "error" ? (
          <div className="flex items-center justify-center space-x-6 mt-5">
            <button
              onClick={generateLogo}
              className="base-button min-w-[100px] bg-[#e3fdce] text-[var(--base-color)]"
            >
              Retry
            </button>

            <Link
              className="base-outline-btn min-w-[100px]"
              href={`/dashboard`}
            >
              Dashboard
            </Link>
          </div>
        ) : (
          ""
        )}
      </div>
    </div>
  );
};

export default GetLogo;
