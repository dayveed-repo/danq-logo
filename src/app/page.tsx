import Image from "next/image";
import HeroForm from "./components/HeroForm";

export default function Home() {
  return (
    <div className="min-h-screen w-full">
      <div className="w-full">
        <div className="w-full max-w-[90%] md:max-w-[85%] mx-auto md:flex items-center md:space-x-9 md:space-y-0 space-y-10">
          <div className="w-full md:w-[55%] md:pt-0 pt-10">
            <h1 className="text-[var(--base-color)] text-[3rem] leading-[56px] font-bold">
              Danq Logo Generator
            </h1>

            <p className="text-medium text-[1.25rem] leading-8 text-gray-500 mt-4 mb-8">
              Create a standout logo in minutes. Danq's AI logo generator makes
              it easy to create a logo and get your brand or business running at
              lighning speed!
            </p>

            <HeroForm />
          </div>

          <Image
            alt="hero"
            src="/images/home-illustration.svg"
            height={0}
            width={0}
            className="object-contain w-[90%] mx-auto h-auto"
          />
        </div>
      </div>
    </div>
  );
}
