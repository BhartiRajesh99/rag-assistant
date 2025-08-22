import type React from "react";
import type { Metadata } from "next";
import { DM_Sans, Space_Grotesk } from "next/font/google";
import "./globals.css";
import { Toaster } from "react-hot-toast";
import { ThemeProvider } from "./context/ThemeContext";

const dmSans = DM_Sans({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-dm-sans",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-space-grotesk",
});

export const metadata: Metadata = {
  title: "RAGify",
  icons: {
    icon: "/bot.svg",
  },
  description: "Upload data and chat with your documents",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Toaster position="top-right" reverseOrder={false} />
      <html
        lang="en"
        className={`${dmSans.variable} ${spaceGrotesk.variable} scrollbar-thin antialiased`}
      >
        <ThemeProvider>
          <body>{children}</body>
        </ThemeProvider>
      </html>
    </>
  );
}
