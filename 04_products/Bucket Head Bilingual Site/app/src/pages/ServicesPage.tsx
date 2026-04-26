import { useTranslation } from 'react-i18next';
import CTAButtonGroup from '@/components/CTAButtonGroup';
import { CheckCircle } from 'lucide-react';
import { asset } from '@/lib/asset';

interface ServiceDetailCardProps {
  image: string;
  title: string;
  description: string;
  price: string;
  items: string[];
  bgColor?: string;
}

function ServiceDetailCard({ image, title, description, price, items, bgColor = 'bg-white' }: ServiceDetailCardProps) {
  const { t } = useTranslation();
  return (
    <div className={`reveal ${bgColor} rounded-xl p-5 md:p-6`}>
      <div className="grid grid-cols-1 md:grid-cols-5 gap-5">
        <div className="md:col-span-2">
          <img src={image} alt={title} className="w-full rounded-lg object-cover aspect-[5/4]" />
        </div>
        <div className="md:col-span-3">
          <h3 className="font-heading font-bold text-xl text-[#1A1A1A] mb-1">{title}</h3>
          <p className="text-brand-blue font-heading font-bold text-sm mb-2">{price}</p>
          <p className="text-[#6B7280] font-body text-sm leading-relaxed mb-4">{description}</p>
          <h4 className="font-heading font-semibold text-sm text-brand-blue mb-2">
            <CheckCircle size={14} className="inline mr-1" />
            {t('services.whatsIncluded')}
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
            {items.map((item, i) => (
              <div key={i} className="flex items-start gap-2">
                <CheckCircle size={14} className="text-brand-yellow flex-shrink-0 mt-0.5" />
                <span className="text-sm text-[#6B7280] font-body">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ServicesPage() {
  const { t } = useTranslation();

  const vehicleCards = [
    {
      image: asset('/assets/service-exterior-detail.jpg'),
      title: t('services.exteriorTitle'),
      description: t('services.exteriorDesc'),
      price: `${t('services.startingAt')} $69`,
      items: t('services.exteriorItems').split('|'),
    },
    {
      image: asset('/assets/service-interior-detail-wide.jpg'),
      title: t('services.interiorTitle'),
      description: t('services.interiorDesc'),
      price: `${t('services.startingAt')} $79`,
      items: t('services.interiorItems').split('|'),
    },
    {
      image: asset('/assets/service-full-detail-wide.jpg'),
      title: t('services.fullDetailTitle'),
      description: t('services.fullDetailDesc'),
      price: `${t('services.startingAt')} $149`,
      items: t('services.fullDetailItems').split('|'),
    },
    {
      image: asset('/assets/service-interior-detail.jpg'),
      title: t('services.deepInteriorTitle'),
      description: t('services.deepInteriorDesc'),
      price: `${t('services.startingAt')} $189`,
      items: t('services.deepInteriorItems').split('|'),
    },
  ];

  const residentialCards = [
    {
      image: asset('/assets/service-driveway-detail.jpg'),
      title: t('services.drivewayTitle'),
      description: t('services.drivewayDesc'),
      price: `${t('services.startingAt')} $149`,
      items: t('services.drivewayItems').split('|'),
    },
    {
      image: asset('/assets/service-house-detail.jpg'),
      title: t('services.houseWashTitle'),
      description: t('services.houseWashDesc'),
      price: `${t('services.startingAt')} $249`,
      items: t('services.houseWashItems').split('|'),
    },
    {
      image: asset('/assets/service-deck-detail.jpg'),
      title: t('services.deckTitle'),
      description: t('services.deckDesc'),
      price: `${t('services.startingAt')} $149`,
      items: t('services.deckItems').split('|'),
    },
    {
      image: asset('/assets/service-driveway.jpg'),
      title: t('services.walkwayTitle'),
      description: t('services.walkwayDesc'),
      price: `${t('services.startingAt')} $79`,
      items: t('services.walkwayItems').split('|'),
    },
    {
      image: asset('/assets/residential-setup-wide.jpg'),
      title: t('services.bundleTitle'),
      description: t('services.bundleDesc'),
      price: `${t('services.startingAt')} $399`,
      items: t('services.bundleItems').split('|'),
    },
  ];

  return (
    <>
      {/* Page Hero */}
      <section className="bg-brand-blue pt-24 pb-12 md:pt-28 md:pb-16">
        <div className="max-w-[700px] mx-auto px-4 text-center">
          <span className="hero-badge inline-block text-brand-yellow font-heading font-bold text-[11px] uppercase tracking-wider mb-3">
            {t('services.pageLabel')}
          </span>
          <h1 className="hero-heading text-[28px] md:text-4xl font-heading font-bold text-white">
            {t('services.heading')}
          </h1>
          <p className="hero-subheading text-white/80 font-body text-base max-w-[550px] mx-auto mt-3">
            {t('services.subheading')}
          </p>
          <div className="hero-cta mt-6 flex justify-center">
            <CTAButtonGroup />
          </div>
        </div>
      </section>

      {/* Vehicle Services */}
      <section className="bg-white py-12 md:py-16">
        <div className="max-w-[1200px] mx-auto px-4 md:px-6 lg:px-8">
          <div className="reveal flex items-center gap-3 mb-3">
            <div className="w-1 h-8 bg-brand-yellow rounded-full" />
            <h2 className="text-brand-blue font-heading font-bold text-sm uppercase tracking-wide">
              {t('services.vehicleHeader')}
            </h2>
          </div>
          <p className="reveal reveal-delay-1 text-[#6B7280] font-body text-[15px] max-w-[600px] mb-6">
            {t('services.vehicleDesc')}
          </p>
          <img
            src={asset('/assets/vehicle-setup-wide.jpg')}
            alt="Vehicle service setup"
            className="reveal w-full rounded-xl aspect-video object-cover mb-8 shadow-[0_2px_8px_rgba(0,0,0,0.08)]"
          />
          <div className="space-y-6">
            {vehicleCards.map((card, i) => (
              <ServiceDetailCard key={i} {...card} bgColor="bg-[#F5F5F5]" />
            ))}
          </div>
        </div>
      </section>

      {/* Residential Services */}
      <section className="bg-light-blue py-12 md:py-16">
        <div className="max-w-[1200px] mx-auto px-4 md:px-6 lg:px-8">
          <div className="reveal flex items-center gap-3 mb-3">
            <div className="w-1 h-8 bg-brand-yellow rounded-full" />
            <h2 className="text-brand-blue font-heading font-bold text-sm uppercase tracking-wide">
              {t('services.residentialHeader')}
            </h2>
          </div>
          <p className="reveal reveal-delay-1 text-[#6B7280] font-body text-[15px] max-w-[600px] mb-6">
            {t('services.residentialDesc')}
          </p>
          <img
            src={asset('/assets/residential-setup-wide.jpg')}
            alt="Residential service setup"
            className="reveal w-full rounded-xl aspect-video object-cover mb-8 shadow-[0_2px_8px_rgba(0,0,0,0.08)]"
          />
          <div className="space-y-6">
            {residentialCards.map((card, i) => (
              <ServiceDetailCard key={i} {...card} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-brand-blue py-12 md:py-16">
        <div className="max-w-[600px] mx-auto px-4 text-center">
          <h2 className="reveal text-2xl md:text-3xl font-heading font-bold text-white mb-3">
            {t('services.notSure')}
          </h2>
          <p className="reveal reveal-delay-1 text-white/85 font-body text-base mb-6">
            {t('services.notSureDesc')}
          </p>
          <div className="reveal reveal-delay-2 flex justify-center">
            <CTAButtonGroup />
          </div>
        </div>
      </section>
    </>
  );
}
