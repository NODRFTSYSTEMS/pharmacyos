import { NextIntlClientProvider, hasLocale } from "next-intl";
import { getMessages } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import { inter, jetbrainsMono, syne } from "@/lib/fonts";
import { Nav } from "@/components/layout/Nav";
import { Footer } from "@/components/layout/Footer";
import { SkipLink } from "@/components/layout/SkipLink";
import { AnimatedLayout } from "@/components/layout/AnimatedLayout";
import Script from "next/script";
import type { Metadata } from "next";

export const metadata: Metadata = {
  metadataBase: new URL("https://nodrftsystems.com"),
  icons: { icon: "/assets/favicon.svg" },
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
      className={`${inter.variable} ${jetbrainsMono.variable} ${syne.variable}`}
      suppressHydrationWarning
    >
      <body>
        <Script
          id="theme-init"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{
            __html: `(function(){var s=localStorage.getItem('ndrf-theme');var m=window.matchMedia('(prefers-color-scheme: light)').matches;document.documentElement.setAttribute('data-theme',s||(m?'light':'dark'));})();`,
          }}
        />
        <NextIntlClientProvider messages={messages} locale={locale}>
          <SkipLink label={locale === "es" ? "Saltar al contenido" : "Skip to content"} />
          <Nav />
          <main id="main-content" tabIndex={-1}>
            <AnimatedLayout>{children}</AnimatedLayout>
          </main>
          <Footer />
        </NextIntlClientProvider>

        {process.env.NEXT_PUBLIC_GA4_ID && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA4_ID}`}
              strategy="afterInteractive"
            />
            <Script id="ga4-init" strategy="afterInteractive">
              {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${process.env.NEXT_PUBLIC_GA4_ID}');`}
            </Script>
          </>
        )}
      </body>
    </html>
  );
}
