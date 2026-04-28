import type { ReactNode } from "react";
import "./globals.css";
import HelpButton from "@/components/HelpButton";
import SmoothFlowRegistry from "@/components/SmoothFlowRegistry";
import { ThemeProvider } from "@/components/ThemeProvider";

export const metadata = {
  title: "Quizaro | Institutional Intelligence Core",
  description: "AI-Powered Advanced Adaptive Assessment & Examination Platform for Institutional Excellence.",
};

export default function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning className="scroll-smooth">
      <body className="antialiased bg-white dark:bg-[#050816] text-gray-900 dark:text-white transition-colors duration-500 selection:bg-blue-100 dark:selection:bg-blue-900/30 selection:text-blue-600">
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          forcedTheme="light"
          enableSystem={false}
          disableTransitionOnChange
        >
          <SmoothFlowRegistry />
          <div className="relative min-h-screen flex flex-col">
             {children}
          </div>
          <HelpButton />
        </ThemeProvider>
      </body>
    </html>
  );
}