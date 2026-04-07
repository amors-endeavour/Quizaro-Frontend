import type { ReactNode } from "react";
import "./globals.css";
import HelpButton from "@/components/HelpButton";

export const metadata = {
  title: "Quizaro - Smart Online Test Platform",
  description: "AI-Powered Exam Preparation Platform",
};

export default function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
        <HelpButton />
      </body>
    </html>
  );
}