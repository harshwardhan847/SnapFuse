export const seoConfig = {
  title: "justplay - AI Image & Video Generation Platform",
  description:
    "Create stunning AI-generated images and videos with justplay. Professional AI content creation platform with credit-based pricing, subscription plans, and enterprise features.",
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
    "enterprise AI",
  ],
  url: "https://justplay.ai", // Update with your actual domain
  siteName: "justplay",
  images: {
    default: "/og-image.png",
    twitter: "/twitter-image.png",
  },
  locale: "en_US",
  type: "website",
  authors: ["justplay Team"],
  creator: "justplay",
  publisher: "justplay",
  robots: "index, follow",
  googleSiteVerification: "", // Add your Google Search Console verification code
  bingSiteVerification: "", // Add your Bing Webmaster verification code
  yandexVerification: "", // Add your Yandex verification code
  social: {
    twitter: "@justplay",
    facebook: "justplay",
    linkedin: "company/justplay",
    instagram: "justplay",
  },
  contact: {
    email: "hello@justplay.ai",
    phone: "+1-555-justplay",
  },
  organization: {
    name: "justplay",
    url: "https://justplay.ai",
    logo: "https://justplay.ai/logo.png",
    sameAs: [
      "https://twitter.com/justplay",
      "https://facebook.com/justplay",
      "https://linkedin.com/company/justplay",
      "https://instagram.com/justplay",
    ],
  },
};

export const generateMetadata = (
  title?: string,
  description?: string,
  image?: string,
  noIndex?: boolean
) => {
  const metaTitle = title
    ? `${title} | ${seoConfig.siteName}`
    : seoConfig.title;
  const metaDescription = description || seoConfig.description;
  const metaImage = image || seoConfig.images.default;

  return {
    title: metaTitle,
    description: metaDescription,
    keywords: seoConfig.keywords.join(", "),
    authors: seoConfig.authors.map((author) => ({ name: author })),
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
