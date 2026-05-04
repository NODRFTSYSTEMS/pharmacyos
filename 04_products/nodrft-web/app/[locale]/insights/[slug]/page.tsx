import { notFound } from "next/navigation";
import type { Metadata } from "next";

type Props = { params: Promise<{ locale: string; slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;
  return {
    title: `Insights — NoDrftSystems`,
    alternates: {
      canonical: `https://nodrftsystems.com/${locale}/insights/${slug}`,
    },
  };
}

// Phase 4 will populate this with MDX content — no slug renders until then
export default async function InsightPage(_props: Props) {
  notFound();
}
