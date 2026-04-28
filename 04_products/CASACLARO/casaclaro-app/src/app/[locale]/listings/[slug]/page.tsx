import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { SYNTHETIC_LISTINGS } from "@/data/listings.seed";
import { ListingDetail } from "@/components/listings/ListingDetail";
import { routing } from "@/i18n/navigation";

interface Props {
  params: Promise<{ slug: string; locale: string }>;
}

export function generateStaticParams() {
  const paths: { locale: string; slug: string }[] = [];
  for (const locale of routing.locales) {
    for (const listing of SYNTHETIC_LISTINGS) {
      paths.push({ locale, slug: listing.slug });
    }
  }
  return paths;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug, locale } = await params;
  const listing = SYNTHETIC_LISTINGS.find((l) => l.slug === slug);
  if (!listing) return {};

  const isEn = locale !== "es";
  const title = `${listing.neighborhood}, ${listing.city} — ${listing.property_type}`;
  const description = isEn ? listing.description_en : listing.description_es;
  const price = listing.listing_type === "sale"
    ? `$${listing.price_usd.toLocaleString()} USD`
    : `$${listing.price_usd.toLocaleString()} USD/mo`;

  return {
    title,
    description: `${price} · ${description.slice(0, 140)}`,
    openGraph: {
      title: `${title} | CasaClaro`,
      description: `${price} · ${listing.bedrooms}BR ${listing.area_sqm}m² in ${listing.neighborhood}, ${listing.city}`,
      images: [
        {
          url: listing.images.find((i) => i.is_primary)?.url ?? listing.images[0].url,
          width: 900,
          height: 600,
          alt: `${listing.neighborhood}, ${listing.city}`,
        },
      ],
    },
  };
}

export default async function ListingDetailPage({ params }: Props) {
  const { slug } = await params;
  const listing = SYNTHETIC_LISTINGS.find((l) => l.slug === slug);
  if (!listing) notFound();

  const similarListings = SYNTHETIC_LISTINGS.filter(
    (l) => l.slug !== slug && l.city === listing.city
  ).slice(0, 3);

  return <ListingDetail listing={listing} similarListings={similarListings} />;
}
