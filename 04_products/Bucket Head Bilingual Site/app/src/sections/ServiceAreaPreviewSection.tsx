import { useTranslation } from 'react-i18next';
import { MapPin } from 'lucide-react';
import SectionHeader from '@/components/SectionHeader';
import { PHONE_LINK } from '@/lib/constants';

const cities = [
  'Lawrenceville', 'Suwanee', 'Buford', 'Dacula', 'Lilburn', 'Snellville',
  'Grayson', 'Loganville', 'Duluth', 'Norcross', 'Peachtree Corners', 'Sugar Hill',
];

export default function ServiceAreaPreviewSection() {
  const { t } = useTranslation();

  return (
    <section className="bg-brand-blue py-12 md:py-16">
      <div className="max-w-[1200px] mx-auto px-4 md:px-6 lg:px-8">
        <SectionHeader
          label={t('home.serviceArea.label')}
          heading={t('home.serviceArea.heading')}
          subheading={t('home.serviceArea.subheading')}
          light
        />
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2 max-w-[600px] mx-auto">
          {cities.map((city, i) => (
            <div key={city} className={`reveal reveal-delay-${Math.min(i, 5)} flex items-center gap-2`}>
              <MapPin size={12} className="text-brand-yellow flex-shrink-0" />
              <span className="text-white/90 font-body text-[15px]">{city}</span>
            </div>
          ))}
        </div>
        <div className="reveal text-center mt-6">
          <p className="text-white/80 font-body text-[15px] mb-4">
            {t('home.serviceArea.notSure')}
          </p>
          <a
            href={PHONE_LINK}
            className="inline-flex items-center justify-center bg-brand-yellow text-brand-blue font-heading font-bold text-base px-7 py-3.5 rounded-lg shadow-[0_2px_4px_rgba(0,0,0,0.15)] hover:brightness-105 transition-all"
          >
            {t('cta.callNow')}
          </a>
        </div>
      </div>
    </section>
  );
}
