import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "One Page News App - AI, Stock & Election Updates",
  description: "Stay updated with the latest news on AI, Stock Market, and Elections. Mobile-friendly news cards with daily updates.",
  keywords: ["news", "AI", "stock market", "elections", "daily updates"],
  authors: [{ name: "One Page News App" }],
  viewport: "width=device-width, initial-scale=1, maximum-scale=5",
  themeColor: "#3B82F6",
  manifest: "/manifest.json",
  openGraph: {
    title: "One Page News App",
    description: "Latest news on AI, Stock Market, and Elections",
    type: "website",
    locale: "en_US",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.variable}>
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
      </head>
      <body className={`${inter.className} min-h-screen`}>
        {children}
      </body>
    </html>
  );
}
