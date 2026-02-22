import type { Metadata } from "next";
import { DM_Sans, Syne, DM_Mono } from "next/font/google";
import "./globals.css";

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-body",
  weight: ["300", "400", "500", "600"],
  display: "swap"
});

const syne = Syne({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["400", "500", "600", "700", "800"],
  display: "swap"
});

const dmMono = DM_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  weight: ["300", "400", "500"],
  display: "swap"
});

export const metadata: Metadata = {
  title: "AI Image Studio",
  description: "Midjourney-style image generation and editing workspace"
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`dark ${dmSans.variable} ${syne.variable} ${dmMono.variable}`}>
      <body className="font-body">{children}</body>
    </html>
  );
}
