export const seoConfig = {
    title: "SnapFuse - AI Image & Video Generation Platform",
    description: "Create stunning AI-generated images and videos with SnapFuse. Professional AI content creation platform with credit-based pricing, subscription plans, and enterprise features.",
    keywords: [
        "AI image generation",
        "AI video creation",
        "artificial intelligence",
        "content creation",
        "digital art",
        "AI tools",
        "image generator",
        "video generator",
        "creative AI",
        "automated content",
        "machine learning",
        "generative AI",
        "visual content",
        "AI platform",
        "SaaS",
        "subscription",
        "enterprise AI"
    ],
    url: "https://snapfuse.ai", // Update with your actual domain
    siteName: "SnapFuse",
    images: {
        default: "/og-image.png",
        twitter: "/twitter-image.png"
    },
    locale: "en_US",
    type: "website",
    authors: ["SnapFuse Team"],
    creator: "SnapFuse",
    publisher: "SnapFuse",
    robots: "index, follow",
    googleSiteVerification: "", // Add your Google Search Console verification code
    bingSiteVerification: "", // Add your Bing Webmaster verification code
    yandexVerification: "", // Add your Yandex verification code
    social: {
        twitter: "@snapfuse",
        facebook: "snapfuse",
        linkedin: "company/snapfuse",
        instagram: "snapfuse"
    },
    contact: {
        email: "hello@snapfuse.ai",
        phone: "+1-555-SNAPFUSE"
    },
    organization: {
        name: "SnapFuse",
        url: "https://snapfuse.ai",
        logo: "https://snapfuse.ai/logo.png",
        sameAs: [
            "https://twitter.com/snapfuse",
            "https://facebook.com/snapfuse",
            "https://linkedin.com/company/snapfuse",
            "https://instagram.com/snapfuse"
        ]
    }
};

export const generateMetadata = (
    title?: string,
    description?: string,
    image?: string,
    noIndex?: boolean
) => {
    const metaTitle = title ? `${title} | ${seoConfig.siteName}` : seoConfig.title;
    const metaDescription = description || seoConfig.description;
    const metaImage = image || seoConfig.images.default;

    return {
        title: metaTitle,
        description: metaDescription,
        keywords: seoConfig.keywords.join(", "),
        authors: seoConfig.authors.map(author => ({ name: author })),
        creator: seoConfig.creator,
        publisher: seoConfig.publisher,
        robots: noIndex ? "noindex, nofollow" : seoConfig.robots,
        openGraph: {
            title: metaTitle,
            description: metaDescription,
            url: seoConfig.url,
            siteName: seoConfig.siteName,
            images: [
                {
                    url: metaImage,
                    width: 1200,
                    height: 630,
                    alt: metaTitle,
                },
            ],
            locale: seoConfig.locale,
            type: seoConfig.type,
        },
        twitter: {
            card: "summary_large_image",
            title: metaTitle,
            description: metaDescription,
            images: [metaImage],
            creator: seoConfig.social.twitter,
        },
        verification: {
            google: seoConfig.googleSiteVerification,
            bing: seoConfig.bingSiteVerification,
            yandex: seoConfig.yandexVerification,
        },
        alternates: {
            canonical: seoConfig.url,
        },
    };
};