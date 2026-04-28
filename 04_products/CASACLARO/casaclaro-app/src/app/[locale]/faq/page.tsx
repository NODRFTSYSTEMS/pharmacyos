import type { Metadata } from "next";
import { FAQContent } from "./FAQContent";

interface Props {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const isEn = locale !== "es";
  return {
    title: isEn ? "FAQ — CasaClaro" : "Preguntas Frecuentes — CasaClaro",
    description: isEn
      ? "Answers to common questions about buying, renting, and relocating to Colombia."
      : "Respuestas a preguntas comunes sobre comprar, arrendar y reubicarse en Colombia.",
  };
}

export default async function FAQPage({ params }: Props) {
  const { locale } = await params;
  return <FAQContent locale={locale === "es" ? "es" : "en"} />;
}
