"use client";
import Image from "next/image";
import { useContext, useEffect, useState } from "react";
import { UserContext } from "../provider";
import Link from "next/link";
import { PropagateLoader } from "react-spinners";

const Dashboard = () => {
  const { userDetail, setuserDetail } = useContext(UserContext);

  const [logos, setlogos] = useState<{ [key: string]: any }[]>([]);
  const [fetchingRecords, setfetchingRecords] = useState(true);

  const fetchLogos = async () => {
    if (!userDetail?.user || !userDetail?.user?.email)
      return setfetchingRecords(false);

    setfetchingRecords(true);
    try {
      const results = await fetch(
        `/api/logos?userEmail=${userDetail?.user?.email}`
      );
      const logosRes = await results.json();
      if (!logosRes || !logosRes.logos) {
        return setfetchingRecords(false);
      }
      setlogos(logosRes?.logos || []);
      setfetchingRecords(false);
    } catch (error) {
      setfetchingRecords(false);
      console.log(error);
    }
  };

  useEffect(() => {
    fetchLogos();
  }, [userDetail?.user?.email]);

  return (
    <div className="py-[3%] w-full">
      <div className="max-w-[90%] md:max-w-[70%] mx-auto w-full">
        <div className="flex items-center justify-between">
          <h2 className="text-[var(--base-color)] text-[1.25rem] md:text-[1.75rem] leading-9 font-bold">
            Hello, {userDetail?.user?.name || ""}
          </h2>

          <div className="flex items-center space-x-4">
            <p className="text-medium text-[0.875rem] leading-5 text-gray-500">
              {userDetail?.user?.numOfCredits || 0} Credits Left
            </p>

            <Link href="/create?step=1" className="base-button min-h-[40px]">
              Create Logo
            </Link>
          </div>
        </div>

        {fetchingRecords ? (
          <div className="w-full mt-8 flex flex-col items-center relative">
            <PropagateLoader
              color={"#163f44"}
              loading={fetchingRecords}
              size={30}
              // aria-label="Loading Spinner"
              data-testid="loader"
            />

            <p
              className={`font-medium mt-8 text-[1rem] leading-6 ${"text-gray-500"} text-center`}
            >
              Loading Logos...
            </p>
          </div>
        ) : (
          <>
            {logos.length ? (
              <div className="mt-6 grid sm:grid-cols-2 md:grid-cols-4 gap-x-5 gap-y-6 md:gap-y-8">
                {logos.map((logo, idx) => (
                  <Link href={`/logo/${logo.id}`} key={idx} className="w-full">
                    <Image
                      src={logo?.imageUrl || ""}
                      alt={logo?.title || ""}
                      height={0}
                      width={0}
                      unoptimized
                      className="w-full h-auto object-contain rounded-lg shadow-sm"
                    />

                    <div className="w-full mt-3 space-y-2">
                      <h4
                        className={`font-semibold text-[1rem] leading-6 text-[var(--base-color)]`}
                      >
                        {logo.title || ""}
                      </h4>
                      <p className={`text-[0.875rem] leading-4 text-gray-500`}>
                        {logo.description
                          ? `${
                              logo.description.length > 50
                                ? logo.description.slice(0, 50) + "..."
                                : logo.description
                            }`
                          : ""}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="mt-8">
                <p
                  className={`font-medium text-[1.25rem] leading-7 ${"text-gray-500"} text-center`}
                >
                  No Logos Found
                </p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
