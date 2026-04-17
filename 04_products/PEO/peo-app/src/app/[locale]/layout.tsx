import { NextIntlClientProvider, hasLocale } from "next-intl";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/navigation";
import { getMessages } from "next-intl/server";
import { Syne, DM_Sans, IBM_Plex_Mono } from "next/font/google";
import type { Metadata } from "next";
import "../globals.css";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

export const metadata: Metadata = {
  metadataBase: new URL("https://peakequityoptimizer.com"),
  openGraph: {
    siteName: "Peak Equity Optimizer",
    type: "website",
    locale: "en_US",
    images: [
      {
        url: "/og-default.png",
        width: 1200,
        height: 630,
        alt: "Peak Equity Optimizer — Real Estate Deal Analysis & ARV Platform",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@PeakEquityOpt",
  },
};

const syne = Syne({
  variable: "--font-syne",
  subsets: ["latin"],
  weight: ["400", "600", "700", "800"],
});

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500"],
});

const ibmPlexMono = IBM_Plex_Mono({
  variable: "--font-ibm-plex-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
});

const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Peak Equity Optimizer",
  url: "https://peakequityoptimizer.com",
  logo: "https://peakequityoptimizer.com/og-default.png",
  description:
    "Real estate intelligence platform providing verified ARV, live comps, and strategy-specific deal analysis for sellers and investors.",
  sameAs: [],
};

const softwareSchema = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "Peak Equity Optimizer",
  applicationCategory: "FinanceApplication",
  operatingSystem: "Web",
  url: "https://peakequityoptimizer.com",
  offers: [
    { "@type": "Offer", price: "0", priceCurrency: "USD", name: "Free Estimator" },
    { "@type": "Offer", price: "49", priceCurrency: "USD", name: "Seller Analysis", priceSpecification: { "@type": "UnitPriceSpecification", unitText: "property" } },
    { "@type": "Offer", price: "99", priceCurrency: "USD", name: "Investor Basic", priceSpecification: { "@type": "UnitPriceSpecification", unitText: "month" } },
    { "@type": "Offer", price: "299", priceCurrency: "USD", name: "Investor Advanced", priceSpecification: { "@type": "UnitPriceSpecification", unitText: "month" } },
  ],
  description:
    "Verify ARV, calculate MAO, and analyze flip, BRRRR, rental, and wholesale deals with live comps and verified data.",
};

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  const messages = await getMessages();

  return (
    <html
      lang={locale}
      data-scroll-behavior="smooth"
      className={`${syne.variable} ${dmSans.variable} ${ibmPlexMono.variable}`}
    >
      <head>
        <link rel="alternate" hrefLang="en" href={`https://peakequityoptimizer.com/en`} />
        <link rel="alternate" hrefLang="es" href={`https://peakequityoptimizer.com/es`} />
        <link rel="alternate" hrefLang="x-default" href={`https://peakequityoptimizer.com/en`} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareSchema) }}
        />
      </head>
      <body className="antialiased">
        <NextIntlClientProvider messages={messages}>
          <a
            href="#main-content"
            className="skip-link"
            style={{
              position: "fixed",
              top: 0,
              left: "16px",
              transform: "translateY(-100%)",
              background: "var(--gold)",
              color: "#070a10",
              padding: "8px 20px",
              fontWeight: 700,
              fontSize: "0.875rem",
              borderRadius: "0 0 8px 8px",
              zIndex: 9999,
              textDecoration: "none",
              transition: "transform 0.15s ease",
            }}
          >
            Skip to main content
          </a>
          <div className="flex flex-col min-h-screen">
            <Header />
            <main id="main-content" className="flex-1 relative z-10">{children}</main>
            <Footer />
          </div>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
