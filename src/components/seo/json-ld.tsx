"use client";

import { seoConfig } from "@/config/seo";

export function JsonLd() {
    const organizationSchema = {
        "@context": "https://schema.org",
        "@type": "Organization",
        name: seoConfig.organization.name,
        url: seoConfig.organization.url,
        logo: seoConfig.organization.logo,
        sameAs: seoConfig.organization.sameAs,
        contactPoint: {
            "@type": "ContactPoint",
            telephone: seoConfig.contact.phone,
            contactType: "customer service",
            email: seoConfig.contact.email,
        },
    };

    const websiteSchema = {
        "@context": "https://schema.org",
        "@type": "WebSite",
        name: seoConfig.siteName,
        url: seoConfig.url,
        description: seoConfig.description,
        publisher: {
            "@type": "Organization",
            name: seoConfig.organization.name,
        },
        potentialAction: {
            "@type": "SearchAction",
            target: {
                "@type": "EntryPoint",
                urlTemplate: `${seoConfig.url}/search?q={search_term_string}`,
            },
            "query-input": "required name=search_term_string",
        },
    };

    const softwareApplicationSchema = {
        "@context": "https://schema.org",
        "@type": "SoftwareApplication",
        name: seoConfig.siteName,
        description: seoConfig.description,
        url: seoConfig.url,
        applicationCategory: "BusinessApplication",
        operatingSystem: "Web Browser",
        offers: [
            {
                "@type": "Offer",
                name: "Free Plan",
                price: "0",
                priceCurrency: "USD",
                description: "10 credits per month with basic features",
            },
            {
                "@type": "Offer",
                name: "Starter Plan",
                price: "9.99",
                priceCurrency: "USD",
                description: "100 credits per month with priority support",
            },
            {
                "@type": "Offer",
                name: "Pro Plan",
                price: "19.99",
                priceCurrency: "USD",
                description: "250 credits per month with advanced features",
            },
            {
                "@type": "Offer",
                name: "Enterprise Plan",
                price: "49.99",
                priceCurrency: "USD",
                description: "750 credits per month with all features",
            },
        ],
        aggregateRating: {
            "@type": "AggregateRating",
            ratingValue: "4.8",
            reviewCount: "1247",
        },
        author: {
            "@type": "Organization",
            name: seoConfig.organization.name,
        },
    };

    const breadcrumbSchema = {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: [
            {
                "@type": "ListItem",
                position: 1,
                name: "Home",
                item: seoConfig.url,
            },
            {
                "@type": "ListItem",
                position: 2,
                name: "Pricing",
                item: `${seoConfig.url}/pricing`,
            },
            {
                "@type": "ListItem",
                position: 3,
                name: "Dashboard",
                item: `${seoConfig.url}/dashboard`,
            },
        ],
    };

    const faqSchema = {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: [
            {
                "@type": "Question",
                name: "What is SnapFuse?",
                acceptedAnswer: {
                    "@type": "Answer",
                    text: "SnapFuse is an AI-powered platform for generating high-quality images and videos using advanced artificial intelligence technology.",
                },
            },
            {
                "@type": "Question",
                name: "How does the credit system work?",
                acceptedAnswer: {
                    "@type": "Answer",
                    text: "Each image generation costs 1 credit and each video generation costs 5 credits. Credits are included in your subscription plan or can be purchased as top-ups.",
                },
            },
            {
                "@type": "Question",
                name: "What subscription plans are available?",
                acceptedAnswer: {
                    "@type": "Answer",
                    text: "We offer Free (10 credits/month), Starter ($9.99/month, 100 credits), Pro ($19.99/month, 250 credits), and Enterprise ($49.99/month, 750 credits) plans.",
                },
            },
            {
                "@type": "Question",
                name: "Can I upgrade or downgrade my plan?",
                acceptedAnswer: {
                    "@type": "Answer",
                    text: "Yes, you can upgrade or downgrade your subscription plan at any time from your dashboard settings.",
                },
            },
        ],
    };

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify(organizationSchema),
                }}
            />
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify(websiteSchema),
                }}
            />
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify(softwareApplicationSchema),
                }}
            />
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify(breadcrumbSchema),
                }}
            />
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify(faqSchema),
                }}
            />
        </>
    );
}