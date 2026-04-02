import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Quizaro - Online Quiz Platform",
  description: "Take quizzes, track your progress, and compete with others",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
