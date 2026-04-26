import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "estimator" });
  const title = t("title");
  const description = t("subtitle");
  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: [
        {
          url: "/og-default.png",
          width: 1024,
          height: 1024,
          alt: title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

export default function EstimatorLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
