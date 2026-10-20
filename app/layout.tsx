import type { Metadata, Viewport } from "next";
import { Dancing_Script, Be_Vietnam_Pro } from "next/font/google";
import { siteConfig } from "@/config/site";
import "./globals.css";

const dancingScript = Dancing_Script({
  variable: "--font-dancing-script",
  subsets: ["latin", "vietnamese"],
  weight: ["400", "600", "700"],
  display: "swap",
});

const beVietnamPro = Be_Vietnam_Pro({
  variable: "--font-be-vietnam-pro",
  subsets: ["latin", "vietnamese"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.meta.url),
  title: siteConfig.meta.title,
  description: siteConfig.meta.description,
  keywords: siteConfig.meta.keywords,
  openGraph: {
    title: siteConfig.meta.title,
    description: siteConfig.meta.description,
    url: siteConfig.meta.url,
    siteName: siteConfig.event.title,
    images: [
      {
        url: `${process.env.NEXT_PUBLIC_BASE_PATH || ""}/og-image.png`,
        width: 1200,
        height: 630,
        alt: siteConfig.event.title,
      },
    ],
    locale: "vi_VN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.meta.title,
    description: siteConfig.meta.description,
    images: [`${process.env.NEXT_PUBLIC_BASE_PATH || ""}/og-image.png`],
  },
  icons: {
    icon: `${process.env.NEXT_PUBLIC_BASE_PATH || ""}/favicon.ico`,
  },
};

export const viewport: Viewport = {
  themeColor: "#ffe4e6", // rose-100 pastel
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="vi"
      className={`${dancingScript.variable} ${beVietnamPro.variable} scroll-smooth`}
    >
      <body className="min-h-screen bg-gradient-to-br from-[#fff5f5] via-[#fff0f3] to-[#ffe4e9] text-gray-800 font-sans antialiased selection:bg-rose-200 selection:text-rose-800">
        {children}
      </body>
    </html>
  );
}
