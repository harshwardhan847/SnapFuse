"use client";

import LandingPage from "@/components/landingPage";
import { useClerk } from "@clerk/nextjs";
import { useRouter } from "next/navigation";

export default function Home() {
  const { isSignedIn } = useClerk();
  const router = useRouter();

  if (isSignedIn) {
    router.push("/dashboard/home");
    return null;
  }
  return <LandingPage />;
}
