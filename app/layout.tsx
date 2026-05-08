import type { ReactNode } from "react";
import { Barlow, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import HelpButton from "@/components/HelpButton";
import SmoothFlowRegistry from "@/components/SmoothFlowRegistry";

const barlow = Barlow({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  variable: "--font-barlow",
});

const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains",
});

import Script from "next/script";

export const metadata = {
  title: "Quizaro — Deploy Your Data-Driven Apps",
  description: "A clean, technical platform for building data-intensive applications. Prisma-powered, developer-friendly, production-ready.",
};

export default function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning className="scroll-smooth">
      <body className={`${barlow.variable} ${jetbrains.variable} antialiased bg-bg text-ink selection:bg-brand/30 selection:text-ink`}>
        <Script 
          src="https://checkout.razorpay.com/v1/checkout.js"
          strategy="beforeInteractive"
        />
        <SmoothFlowRegistry />
        <div className="relative min-h-screen flex flex-col">
          {children}
        </div>
        <HelpButton />
      </body>
    </html>
  );
}
