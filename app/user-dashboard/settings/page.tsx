"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function StudentSettingsRedirect() {
  const router = useRouter();
  useEffect(() => {
    router.replace("/user-dashboard/profile");
  }, [router]);
  return null;
}
