import { ComingSoon } from "@/components/ComingSoon";

interface Props { params: Promise<{ locale: string }> }

export default async function TermsPage({ params }: Props) {
  const { locale: raw } = await params;
  const locale = raw === "es" ? "es" : "en";
  return (
    <ComingSoon
      locale={locale}
      titleEn="Terms & Privacy"
      titleEs="Términos y Privacidad"
      descEn="Our terms of use and privacy policy are being prepared. For any questions, contact us at hello@casaclaro.co."
      descEs="Nuestros términos de uso y política de privacidad están en preparación. Para cualquier consulta, escríbenos a hello@casaclaro.co."
    />
  );
}
