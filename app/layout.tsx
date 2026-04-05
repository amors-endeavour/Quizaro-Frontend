import type { ReactNode } from "react";
import "./globals.css";

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
      <body>{children}</body>
    </html>
  );
}