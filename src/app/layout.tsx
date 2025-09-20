import type { Metadata } from "next";
import { Open_Sans } from "next/font/google";
import "./globals.css";
import Navbar from "./components/Navbar";
import { ClerkProvider } from "@clerk/nextjs";
import Provider from "./provider";

const openSans = Open_Sans({
  subsets: ["latin"],
});

// const geistMono = Geist_Mono({
//   variable: "--font-geist-mono",
//   subsets: ["latin"],
// });

export const metadata: Metadata = {
  title: "Danq Logo Generator",
  description:
    "Create a standout logo in minutes. Danq's AI logo generator makes it easy to create a logo and get your brand or business running at lighning speed!",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body
          className={`${openSans.className} antialiased `}
          suppressHydrationWarning
        >
          <Provider>
            <Navbar />
            {children}
          </Provider>
        </body>
      </html>
    </ClerkProvider>
  );
}
