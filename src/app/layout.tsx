import type { Metadata } from "next";
import { Cormorant_Garamond, Outfit } from "next/font/google";
import "./globals.css";

const cormorantGaramond = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  style: ["normal", "italic"],
});

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Precious One Photography | Abu Dhabi Newborn & Family Photography",
  description:
    "Precious One Photography - Premium newborn, baby, maternity, and family photography studio in Abu Dhabi, UAE. Timeless memories of your most precious moments.",
  keywords: [
    "newborn photography",
    "baby photography",
    "maternity photography",
    "family photography",
    "Abu Dhabi photography",
    "UAE photographer",
    "baby milestone",
    "cake smash photography",
    "pre-birthday photography",
  ],
  openGraph: {
    title: "Precious One Photography | Abu Dhabi",
    description:
      "Timeless Memories of Your Most Precious Moments. Premium newborn, baby, maternity, and family photography in Abu Dhabi.",
    type: "website",
    locale: "en_US",
    siteName: "Precious One Photography",
  },
  twitter: {
    card: "summary_large_image",
    title: "Precious One Photography | Abu Dhabi",
    description:
      "Timeless Memories of Your Most Precious Moments. Premium newborn, baby, maternity, and family photography in Abu Dhabi.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${cormorantGaramond.variable} ${outfit.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
