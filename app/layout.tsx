import type { Metadata } from "next";
import "./globals.css";

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
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
      </head>
      <body className="min-h-screen font-sans antialiased">
        {children}
      </body>
    </html>
  );
}
