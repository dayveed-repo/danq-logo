"use client";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import colors from "../utils/colors";
import Image from "next/image";
import logoStyleAndPrompt from "../utils/logoStyleAndPrompt";
import pricing from "../utils/pricing";
import { SignInButton, useUser } from "@clerk/nextjs";
import { encrypt } from "../utils/helpers";

const stepsInfo = [
  {
    title: "Logo Title",
    description: "Please enter your business or company name",
  },
  {
    title: "Logo Description",
    description: "Please enter a short description for your brand or business",
  },
  {
    title: "Select A Color Thme",
    description: "Please select a them that best suites your brand or business",
  },
  {
    title: "Choose Your Logo Style",
    description: "Please select a design that best suites your brand or design",
  },
  //   {
  //     title: "Select Other Design Ideas",
  //     description: "Please select a design that best suites your brand or design",
  //   },
  {
    title: "Choose a Payment Plan",
    description: "Please select a suitable payment plan",
  },
];

const CreateLogo = () => {
  const queryParams = useSearchParams();
  let step = queryParams?.get("step");
  let defaultCompany = queryParams?.get("companyName");

  const { isSignedIn } = useUser();
  const router = useRouter();

  const [logoData, setlogoData] = useState({
    title: defaultCompany || "",
    description: "",
    colorTheme: "",
    design: "",
    prompt: "",
  });

  const generateUrl = (plan: string, returnUrl?: boolean) => {
    const cipherText = encrypt(plan);

    if (returnUrl) {
      return `/get-logo/${encodeURIComponent(cipherText)}`;
    }

    window.location.href = `/get-logo/${encodeURIComponent(cipherText)}`;
  };

  useEffect(() => {
    const cahedData = localStorage.getItem("danqLogoData");

    if (cahedData) {
      setlogoData(JSON.parse(cahedData));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("danqLogoData", JSON.stringify(logoData));
  }, [JSON.stringify(logoData)]);

  const disableBtn = () => {
    if (Number(step) === 1 && !logoData.title) {
      return true;
    } else if (Number(step) === 2 && !logoData.description) {
      return true;
    } else if (Number(step) === 3 && !logoData.colorTheme) {
      return true;
    } else if (Number(step) === 4 && !logoData.design) {
      return true;
    }

    return false;
  };

  return (
    <div className="w-full py-[5%]">
      {step ? (
        <div className="w-full max-w-[90%] md:max-w-[70%] mx-auto border border-gray-200 rounded-lg bg-white px-5 py-6">
          <div className="space-y-4">
            <h3 className="text-[var(--base-color)] text-[1.375rem] leading-8 font-bold">
              {stepsInfo[Number(step) - 1].title || ""}
            </h3>
            <p className="text-medium text-[1rem] leading-4 text-gray-500 mt-4 mb-8">
              {stepsInfo[Number(step) - 1].description || ""}
            </p>
          </div>

          {/*  */}
          {step === "1" ? (
            <div className="w-full mt-8">
              <input
                value={logoData.title}
                onChange={(e) =>
                  setlogoData({ ...logoData, title: e.target.value })
                }
                className="h-[50px] flex-1 outline-[0] outline-[var(--base-color)] focus-within:outline-[2px] bg-[var(--background)] focus:bg-transparent text-base rounded-lg px-4 w-full"
                placeholder="Enter Business Name"
              />
            </div>
          ) : step === "2" ? (
            <div className="w-full mt-8">
              <textarea
                value={logoData.description}
                onChange={(e) =>
                  setlogoData({ ...logoData, description: e.target.value })
                }
                className="flex-1 outline-[0] outline-[var(--base-color)] resize-none min-h-[150px] focus-within:outline-[2px] bg-[var(--background)] focus:bg-transparent text-base rounded-lg px-4 py-2 w-full"
                placeholder="Provide a Brief Description of your Business"
              />
            </div>
          ) : step === "3" ? (
            <div className="w-full mt-8 grid gri-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
              {colors.map((pallet, index) => (
                <div
                  className={`p-1 rounded-lg border-[var(--base-color)] cursor-pointer transition-all hover:scale-[1.08] duration-500 ease-out ${
                    logoData.colorTheme === pallet.name ? "border" : ""
                  }`}
                  key={index}
                  onClick={() =>
                    setlogoData({ ...logoData, colorTheme: pallet.name })
                  }
                >
                  {pallet.colors.map((color, idx) => (
                    <div
                      className="h-6 w-full"
                      key={color}
                      style={{ background: color }}
                    ></div>
                  ))}
                </div>
              ))}
            </div>
          ) : step === "4" ? (
            <div className="w-full mt-8 grid gri-cols-1 md:grid-cols-3 gap-5">
              {logoStyleAndPrompt.map((prompt, index) => (
                <div
                  className={`p-1 rounded-lg border-[var(--base-color)] cursor-pointer space-y-3 ${
                    logoData.design === prompt.title ? "border-[2px]" : ""
                  }`}
                  key={index}
                  onClick={() =>
                    setlogoData({
                      ...logoData,
                      design: prompt.title,
                      prompt: prompt.prompt,
                    })
                  }
                >
                  <Image
                    src={`/images/logo-styles${prompt.image}`}
                    alt={prompt.title}
                    height={0}
                    width={0}
                    unoptimized
                    priority
                    className="h-auto w-full object-contain"
                  />

                  <p className="text-base text-gray-500 font-medium text-center">
                    {prompt.title || ""}
                  </p>
                </div>
              ))}
            </div>
          ) : step === "5" ? (
            <div className="w-full space-y-5 md:space-y-0 md:flex justify-center md:space-x-6 mt-8">
              {pricing.map((price, index) => (
                <div
                  className="bg-[var(--base-color)] rounded-lg p-6 md:w-[50%]"
                  key={index}
                >
                  <h4 className="text-white font-semibold text-[1.25rem] leading-7">
                    {price.title}
                  </h4>

                  <p className="text-white/70 font-normal text-[0.875rem] leading-5 mt-2">
                    {price.description}
                  </p>

                  <div className="space-y-2 mt-6">
                    <div className="flex items-center justify-between">
                      <div className="h-[2px] w-[40%] bg-white/70" />
                      <h5 className="text-white/90 font-medium text-[1rem] leading-5 mx-4">
                        Features
                      </h5>
                      <div className="h-[2px] w-[40%] bg-white/70" />
                    </div>

                    <div className="w-full space-y-2">
                      {price.features.map((ft) => (
                        <p
                          className="text-white/70 text-[0.875rem] leading-5"
                          key={ft}
                        >
                          {ft}
                        </p>
                      ))}
                    </div>
                  </div>

                  {isSignedIn ? (
                    <button
                      onClick={() => {
                        generateUrl(price.title);
                      }}
                      className="base-button min-h-[40px] bg-white text-[var(--base-color)] mt-5"
                    >
                      {price.buttonText}
                    </button>
                  ) : (
                    <SignInButton
                      forceRedirectUrl={generateUrl(price.title, true)}
                      mode="modal"
                    >
                      <button className="base-button min-h-[40px] bg-white text-[var(--base-color)] mt-5">
                        {price.buttonText}
                      </button>
                    </SignInButton>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <></>
          )}

          {/* navigation */}
          <div className="flex items-center mt-7">
            {step && Number(step) > 1 ? (
              <Link
                className="base-outline-btn  min-w-[100px]"
                href={`/create?step=${Number(step) - 1}`}
              >
                Previous
              </Link>
            ) : (
              ""
            )}

            {step && Number(step) < 5 ? (
              <button
                className={`base-button min-w-[100px] min-h-[40px] ml-auto ${
                  disableBtn() ? "opacity-70" : ""
                }`}
                disabled={disableBtn()}
                onClick={() => {
                  router.push(`/create?step=${Number(step) + 1}`);
                }}
              >
                Next
              </button>
            ) : (
              ""
            )}
          </div>
        </div>
      ) : (
        ""
      )}
    </div>
  );
};

export default CreateLogo;
