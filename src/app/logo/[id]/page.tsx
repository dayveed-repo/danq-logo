"use client";

import ErrorIcon from "@/app/components/ErrorIcon";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { PropagateLoader } from "react-spinners";
// @ts-ignore
import { triggerBase64Download } from "react-base64-downloader";

const LogInfo = () => {
  const { id } = useParams<{ id: string }>();
  const [logoData, setlogoData] = useState({
    imageUrl: "",
    title: "",
    description: "",
    createTimestamp: 0,
  });
  const [loadingData, setloadingData] = useState(true);
  const [logoError, setlogoError] = useState("");
  const [downloadingImage, setdownloadingImage] = useState(false);
  const [downloadingImageError, setdownloadingImageError] = useState("");
  const [base64Download, setbase64Download] = useState("");

  // const ref = useRef<HTMLAnchorElement | null>(null);

  const fetchLogoData = async () => {
    if (!id) return setloadingData(false);

    setloadingData(true);
    try {
      const results = await fetch(`/api/logo-info/${id}`);
      const logoRes = await results.json();
      if (!logoRes || !logoRes.logo || !logoRes.logo?.title) {
        setlogoError("Failed to Fetch Logo Details");
        return setloadingData(false);
      }
      setlogoData({
        imageUrl: logoRes?.logo.imageUrl || "",
        createTimestamp: logoRes?.logo.createTimestamp || 0,
        description: logoRes?.logo.description || "",
        title: logoRes?.logo.title || "",
      });
      setloadingData(false);
    } catch (error) {
      setloadingData(false);
      console.log(error);
    }
  };

  const downloadFile = async () => {
    if (!logoData.imageUrl) return;

    setdownloadingImage(true);
    setdownloadingImageError("");

    const loadedImageRes = await fetch("/api/firebase-image", {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({ imageUrl: logoData.imageUrl || "" }),
    });

    let imageJson = await loadedImageRes.json();
    let imageBase64 = imageJson.imageBase64 || "";

    if (!imageBase64) {
      setdownloadingImageError("An error occured while downloading image");
      return setdownloadingImage(false);
    }

    try {
      triggerBase64Download(imageBase64, logoData?.title);
      setdownloadingImage(false);
    } catch (error) {
      setdownloadingImageError("An error occured while downloading image");
      setdownloadingImage(false);
    }
  };

  useEffect(() => {
    fetchLogoData();
  }, []);

  return (
    <div className="py-[5%] w-full">
      {loadingData ? (
        <div className=" logo-detail-wrapper min-h-[40vh] justify-center">
          <PropagateLoader
            color={"#163f44"}
            loading={loadingData}
            size={30}
            aria-label="Loading Spinner"
            data-testid="loader"
          />

          <p
            className={`mt-8 font-medium text-[1rem] leading-6 ${"text-gray-500"} text-center`}
          >
            Loading Logo info...
          </p>
        </div>
      ) : (
        <>
          {logoError ? (
            <div className="logo-detail-wrapper space-y-4">
              <ErrorIcon />
              <p
                className={`text-medium text-[0.875rem] leading-5 ${"text-gray-500"} mt-2 mb-7 text-center`}
              >
                {logoError}
              </p>
            </div>
          ) : (
            <div className="logo-detail-wrapper">
              <h2 className="text-[var(--base-color)] text-[1.5rem] leading-8 font-bold">
                {logoData.title}
              </h2>

              <p
                className={`text-medium text-[0.875rem] leading-5 ${"text-gray-500"} mt-2 mb-7 text-center`}
              >
                {logoData.description}
              </p>

              <div className="w-full md:max-w-[500px] bg-white shadow-sm rounded-md p-3">
                <Image
                  src={logoData.imageUrl || ""}
                  alt={logoData?.title || ""}
                  height={0}
                  width={0}
                  unoptimized={true}
                  className="w-full h-auto object-contain "
                />
              </div>

              <div className="flex items-center justify-center space-x-6 mt-5">
                <button
                  onClick={downloadFile}
                  disabled={downloadingImage}
                  className="base-button min-w-[100px]"
                >
                  {downloadingImage ? "Downloading..." : "Download"}
                </button>

                <a></a>

                <Link
                  className="base-outline-btn min-w-[100px]"
                  href={`/dashboard`}
                >
                  Dashboard
                </Link>
              </div>

              <p className="text-sm text-red-600 mt-3">
                {downloadingImageError}
              </p>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default LogInfo;
