import { useTranslation } from 'react-i18next';
import { ChevronDown } from 'lucide-react';
import WaterCausticCanvas from '@/components/WaterCausticCanvas';
import TrustBadge from '@/components/TrustBadge';
import CTAButtonGroup from '@/components/CTAButtonGroup';

export default function HeroSection() {
  const { t } = useTranslation();

  return (
    <section className="relative min-h-[100dvh] md:min-h-[70vh] flex items-center justify-center overflow-hidden">
      <WaterCausticCanvas />
      {/* Dark gradient overlay */}
      <div
        className="absolute inset-0 z-[1]"
        style={{
          background: 'linear-gradient(to bottom, rgba(0,61,112,0.75) 0%, rgba(0,61,112,0.55) 50%, rgba(0,61,112,0.85) 100%)',
        }}
      />
      {/* Content */}
      <div className="relative z-[2] max-w-[650px] mx-auto px-4 text-center py-20">
        <div className="hero-badge">
          <TrustBadge size="lg" light />
        </div>
        <h1 className="hero-heading text-[28px] md:text-4xl lg:text-[44px] font-heading font-bold text-white leading-tight mt-4"
          style={{ textShadow: '0 2px 12px rgba(0,0,0,0.3)' }}
        >
          {t('home.hero.headline')}
        </h1>
        <p className="hero-subheading text-white/90 text-lg font-body max-w-[520px] mx-auto mt-3">
          {t('home.hero.subheadline')}
        </p>
        <div className="hero-cta mt-6 flex justify-center">
          <CTAButtonGroup stacked />
        </div>
      </div>
      {/* Scroll indicator */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-[2] bounce-indicator">
        <ChevronDown size={24} className="text-white/60" />
      </div>
    </section>
  );
}
