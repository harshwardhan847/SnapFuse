"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Mail } from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { calendlyLink } from "@/constants";

interface FAQItemProps {
  question: string;
  answer: string;
  index: number;
}

function FAQItem({ question, answer, index }: FAQItemProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.3,
        delay: index * 0.15,
        ease: "easeOut",
      }}
      className={cn(
        "group border-border/60 rounded-lg border",
        "transition-all duration-200 ease-in-out",
        isOpen ? "bg-card/30 shadow-sm" : "hover:bg-card/50"
      )}
    >
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full items-center justify-between gap-4 px-6 py-4"
      >
        <h3
          className={cn(
            "text-left text-base font-medium transition-colors duration-200",
            "text-foreground/80",
            isOpen && "text-foreground"
          )}
        >
          {question}
        </h3>
        <motion.div
          animate={{
            rotate: isOpen ? 180 : 0,
            scale: isOpen ? 1.1 : 1,
          }}
          transition={{
            duration: 0.3,
            ease: "easeInOut",
          }}
          className={cn(
            "shrink-0 rounded-full p-0.5",
            "transition-colors duration-200",
            isOpen ? "text-primary" : "text-muted-foreground"
          )}
        >
          <ChevronDown className="h-4 w-4" />
        </motion.div>
      </button>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{
              height: "auto",
              opacity: 1,
              transition: {
                height: {
                  duration: 0.4,
                  ease: [0.04, 0.62, 0.23, 0.98],
                },
                opacity: {
                  duration: 0.25,
                  delay: 0.1,
                },
              },
            }}
            exit={{
              height: 0,
              opacity: 0,
              transition: {
                height: {
                  duration: 0.3,
                  ease: "easeInOut",
                },
                opacity: {
                  duration: 0.25,
                },
              },
            }}
          >
            <div className="border-border/40 border-t px-6 pt-2 pb-4">
              <motion.p
                initial={{ y: -8, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -8, opacity: 0 }}
                transition={{
                  duration: 0.3,
                  ease: "easeOut",
                }}
                className="text-muted-foreground text-sm leading-relaxed"
              >
                {answer}
              </motion.p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default function Faq() {
  const faqs: Omit<FAQItemProps, "index">[] = [
    {
      question: "What makes SnapFuse unique?",
      answer:
        "SnapFuse sets itself apart by instantly generating high-quality, SEO-optimized product content, AI-powered studio images, and professional videos—all in one platform. Unlike traditional solutions, SnapFuse eliminates the need for separate writers, designers, and video editors, saving you time and cost while dramatically accelerating your eCommerce growth.",
    },
    {
      question: "How do I customize the AI-generated content?",
      answer:
        "You have full control over your listing. Simply enter your product details and preferences, and SnapFuse will generate previews for review and edit before finalizing. You can refine titles, images, descriptions, and even select styles for product visuals until you’re completely satisfied with each listing.",
    },
    {
      question: "Does SnapFuse support major eCommerce platforms?",
      answer:
        "Yes, SnapFuse is designed to work seamlessly with leading eCommerce platforms and marketplaces. You can easily copy and download content for direct use on Amazon, Shopify, WooCommerce, Flipkart, and more, with formats optimized for each channel.",
    },
    {
      question: "How do I get started with SnapFuse?",
      answer:
        "Just sign up for a free account, add your product details, and let SnapFuse’s AI generate content instantly. From there, review, customize as needed, and publish or export your catalog—no technical skills required.",
    },
    {
      question: "Can SnapFuse handle large catalogs or enterprise needs?",
      answer:
        "Absolutely. SnapFuse scales effortlessly for both small sellers and enterprise brands. Advanced batch processing, team collaboration, and API integration options are available for businesses with large or rapidly growing catalogs.",
    },
    {
      question: "Is SnapFuse suitable for non-English product listings?",
      answer:
        "SnapFuse currently supports English product generation. We are actively expanding to additional languages and plan to introduce multilingual support soon.",
    },
    {
      question: "How secure is my product data with SnapFuse?",
      answer:
        "SnapFuse prioritizes your privacy and security. All product data and images are encrypted and never shared without your consent. Our platform adheres to industry-standard security practices for your peace of mind.",
    },
    {
      question: "Does SnapFuse offer a free trial?",
      answer:
        "Yes! You can start for free with no credit card required. Our free plan gives you immediate access to core features—try SnapFuse risk-free and upgrade anytime to unlock advanced capabilities and higher usage limits.",
    },
  ];
  return (
    <section
      id="faq"
      className="bg-background dark relative w-full overflow-hidden py-16"
    >
      {/* Decorative elements */}
      <div className="bg-primary/5 absolute top-20 -left-20 h-64 w-64 rounded-full blur-3xl" />
      <div className="bg-primary/5 absolute -right-20 bottom-20 h-64 w-64 rounded-full blur-3xl" />

      <div className="relative container mx-auto max-w-6xl px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mx-auto mb-12 max-w-2xl text-center"
        >
          <Badge
            variant="outline"
            className="border-primary mb-4 px-3 py-1 text-xs font-medium tracking-wider uppercase"
          >
            FAQs
          </Badge>

          <h2 className="from-primary mb-3 bg-gradient-to-r to-rose-400 bg-clip-text text-3xl font-bold text-transparent">
            Frequently Asked Questions
          </h2>
          <p className="text-muted-foreground text-sm">
            Everything you need to know about MVPBlocks
          </p>
        </motion.div>

        <div className="mx-auto max-w-2xl space-y-2">
          {faqs.map((faq, index) => (
            <FAQItem key={index} {...faq} index={index} />
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className={cn("mx-auto mt-12 max-w-md rounded-lg p-6 text-center")}
        >
          <div className="bg-primary/10 text-primary mb-4 inline-flex items-center justify-center rounded-full p-2">
            <Mail className="h-4 w-4" />
          </div>
          <p className="text-foreground mb-1 text-sm font-medium">
            Still have questions?
          </p>
          <p className="text-muted-foreground mb-4 text-xs">
            We&apos;re here to help you
          </p>
          <Link
            href={calendlyLink}
            target="_blank"
            className={cn(
              "rounded-md px-4 py-2 text-sm",
              "bg-primary text-primary-foreground",
              "hover:bg-primary/90",
              "transition-colors duration-200",
              "font-medium"
            )}
          >
            Contact Support
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
