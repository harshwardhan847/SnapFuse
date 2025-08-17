"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import NumberFlow from "@number-flow/react";
import { BadgeCheck } from "lucide-react";
import { motion } from "framer-motion";
import { PricingCard } from "../pricing/pricing-card";
import { SUBSCRIPTION_PLANS } from "@/config/pricing";

const PAYMENT_FREQUENCIES: ("monthly" | "yearly")[] = ["monthly", "yearly"];

const HighlightedBackground = () => (
  <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_110%)] bg-[size:45px_45px] opacity-100 dark:opacity-30" />
);

const PopularBackground = () => (
  <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(240,119,119,0.1),rgba(255,255,255,0))] dark:bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(220,119,118,0.3),rgba(255,255,255,0))]" />
);

const Tab = ({
  text,
  selected,
  setSelected,
  discount = false,
}: {
  text: string;
  selected: boolean;
  setSelected: (text: string) => void;
  discount?: boolean;
}) => {
  return (
    <button
      onClick={() => setSelected(text)}
      className={cn(
        "text-foreground relative w-fit px-4 py-2 text-sm font-semibold capitalize transition-colors",
        discount && "flex items-center justify-center gap-2.5"
      )}
    >
      <span className="relative z-10">{text}</span>
      {selected && (
        <motion.span
          layoutId="tab"
          transition={{ type: "spring", duration: 0.4 }}
          className="bg-background absolute inset-0 z-0 rounded-full shadow-sm"
        ></motion.span>
      )}
      {discount && (
        <Badge
          className={cn(
            "relative z-10 bg-gray-100 text-xs whitespace-nowrap text-black shadow-none hover:bg-gray-100",
            selected
              ? "bg-[#F3F4F6] hover:bg-[#F3F4F6]"
              : "bg-gray-300 hover:bg-gray-300"
          )}
        >
          Save 35%
        </Badge>
      )}
    </button>
  );
};

export default function PricingSection() {
  const [selectedPaymentFreq, setSelectedPaymentFreq] = useState<
    "monthly" | "yearly"
  >(PAYMENT_FREQUENCIES[0]);

  return (
    <section
      id="pricing"
      data-theme="dark"
      className="flex flex-col dark items-center gap-10 py-10"
    >
      <div className="space-y-7 text-center dark:text-white">
        <div className="space-y-4">
          <h1 className="text-2xl  font-medium md:text-5xl">
            Plans and Pricing
          </h1>
          <p className="md:text-base text-sm md:max-w-full max-w-xs">
            Receive unlimited credits when you pay yearly, and save on your
            plan.
          </p>
        </div>
        <div className="mx-auto hidden  w-fit rounded-full bg-[#F3F4F6] p-1 dark:bg-[#222]">
          {PAYMENT_FREQUENCIES.map((freq) => (
            <Tab
              key={freq}
              text={freq}
              selected={selectedPaymentFreq === freq}
              setSelected={(text) =>
                setSelectedPaymentFreq(text as "monthly" | "yearly")
              }
              discount={freq === "yearly"}
            />
          ))}
        </div>
      </div>

      <div className="grid px-4 md:px-0 w-full max-w-6xl grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4">
        {Object.values(SUBSCRIPTION_PLANS).map((plan) => (
          <PricingCard
            key={plan.id}
            plan={plan}
            currentPlan={""}
            onSubscribe={async (planId) => {
              return;
            }}
          />
        ))}
      </div>
    </section>
  );
}
