import type { ReactNode } from "react";
import "./globals.css";
import Navbar from "@/components/Navbar";  

export const metadata = {
  title: "Welcome - Quizaro",
  description: "Smart Online Test Platform",
};

export default function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-gray-50 text-gray-800">
        <Navbar />  
        {children}
      </body>
    </html>
  );
}