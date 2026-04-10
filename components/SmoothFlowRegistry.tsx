"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

export default function SmoothFlowRegistry() {
  const pathname = usePathname();
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Start progress when pathname changes
    setLoading(true);
    setProgress(10);
    
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 90) {
          clearInterval(timer);
          return 90;
        }
        return prev + 15;
      });
    }, 100);

    const finishTimer = setTimeout(() => {
      setLoading(false);
      setProgress(100);
      clearInterval(timer);
    }, 400);

    return () => {
      clearInterval(timer);
      clearTimeout(finishTimer);
    };
  }, [pathname]);

  if (!loading && progress === 100) return null;

  return (
    <div className="fixed top-0 left-0 right-0 z-[9999] pointer-events-none">
      <div 
        className="h-1 bg-gradient-to-r from-blue-600 via-cyan-400 to-blue-600 transition-all duration-300 ease-out shadow-[0_0_10px_rgba(37,99,235,0.5)]"
        style={{ width: `${progress}%`, opacity: loading ? 1 : 0 }}
      />
    </div>
  );
}
