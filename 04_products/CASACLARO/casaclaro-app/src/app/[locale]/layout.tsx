import { NextIntlClientProvider, hasLocale } from "next-intl";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/navigation";
import { getMessages } from "next-intl/server";
import type { Metadata } from "next";
import Script from "next/script";
import "../globals.css";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

export const metadata: Metadata = {
  metadataBase: new URL("https://casaclaro.co"),
  title: {
    default: "CasaClaro | Colombia Property, Rentals & Relocation Intelligence",
    template: "%s | CasaClaro",
  },
  description:
    "Bilingual Colombia property and relocation platform for buyers, renters, sellers, expatriates, retirees, brokers, and families. Compare cities, neighborhoods, and vetted listings.",
  alternates: {
    languages: {
      en: "https://casaclaro.co/en",
      es: "https://casaclaro.co/es",
      "x-default": "https://casaclaro.co",
    },
  },
  openGraph: {
    siteName: "CasaClaro",
    type: "website",
    locale: "en_US",
    images: [
      {
        url: "/api/og",
        width: 1200,
        height: 630,
        alt: "CasaClaro — Colombia Property and Relocation Intelligence",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@CasaClaroHQ",
  },
};

const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "CasaClaro",
  url: "https://casaclaro.co",
  description:
    "Bilingual Colombia property and relocation intelligence platform for buyers, renters, sellers, expatriates, and real estate professionals.",
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

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
    <NextIntlClientProvider messages={messages}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />
      {process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN && (
        <Script
          defer
          data-domain={process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN}
          src="https://plausible.io/js/script.js"
          strategy="afterInteractive"
        />
      )}
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>
      <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh", background: "var(--cream, #fdf5e6)" }}>
        <Header locale={locale} />
        <main id="main-content" style={{ flex: 1 }}>
          {children}
        </main>
        <Footer locale={locale} />
      </div>
    </NextIntlClientProvider>
  );
}
