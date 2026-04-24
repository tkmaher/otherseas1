import { Metadata } from "next";

export const staticMetadata: Metadata = {
    metadataBase: new URL("https://otherseas1.com/"),
    applicationName: "Tom Maher",
    title: {
      template: 'Tom Maher | %s',
      default: 'Tom Maher', // a default is required when creating a template
    },
    description: "otherseas1.com is the website of developer Tom Maher.",
    keywords: ["media", "web design", "sound", "music", "portfolio"],
    robots: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
      googleBot: "index, follow"
    },
    openGraph: {
      locale: "en_US",
      siteName: "otherseas1.com",
      url: "https://otherseas1.com/",
      type: "website",
      images: [
        {
          url: "https://otherseas1.com/logo.png",
          width: 1200,
          height: 630,
          alt: "otherseas1.com"
        }
      ]
    },
    twitter: {
      card: "summary_large_image",
      title: "otherseas1.com",
      
      images: [
        {
          url: "https://otherseas1.com/logo.png",
          width: 1200,
          height: 630,
          alt: "otherseas1.com"
        }
      ]
    }
  };