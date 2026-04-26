import { useTranslation } from 'react-i18next';
import { Shield, MapPin, Clock } from 'lucide-react';

export default function TrustStrip() {
  const { t } = useTranslation();

  const items = [
    { icon: Shield, text: t('home.trustStrip.licensed') },
    { icon: MapPin, text: t('home.trustStrip.location') },
    { icon: Clock, text: t('home.trustStrip.response') },
  ];

  return (
    <section className="bg-white py-6 md:py-8">
      <div className="max-w-[1200px] mx-auto px-4 md:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-center gap-6 md:gap-16">
          {items.map((item, i) => (
            <div key={i} className={`reveal reveal-delay-${i} flex items-center gap-3`}>
              <item.icon size={28} className="text-brand-blue flex-shrink-0" />
              <span className="font-heading font-semibold text-sm text-[#1A1A1A]">
                {item.text}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
