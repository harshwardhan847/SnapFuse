"use client";

import { useUser } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Navbar } from "@/components/navigation/navbar";
import { Zap, Image, Video, CreditCard, Check, ArrowRight } from "lucide-react";
import Link from "next/link";
import { SUBSCRIPTION_PLANS, CREDIT_COSTS } from "@/config/pricing";
import LandingPage from "@/components/landingPage";

export default function Home() {
  return <LandingPage />;
}
