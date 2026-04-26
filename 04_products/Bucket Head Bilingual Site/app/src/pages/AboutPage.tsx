import { useTranslation } from 'react-i18next';
import { Truck, Shield, Eye, Heart } from 'lucide-react';
import SectionHeader from '@/components/SectionHeader';
import CTAButtonGroup from '@/components/CTAButtonGroup';
import TrustBadge from '@/components/TrustBadge';
import { asset } from '@/lib/asset';

const differentiators = [
  { icon: Truck, titleKey: 'about.diff1Title', descKey: 'about.diff1Desc' },
  { icon: Shield, titleKey: 'about.diff2Title', descKey: 'about.diff2Desc' },
  { icon: Eye, titleKey: 'about.diff3Title', descKey: 'about.diff3Desc' },
  { icon: Heart, titleKey: 'about.diff4Title', descKey: 'about.diff4Desc' },
];

const steps = [
  { num: '1', titleKey: 'about.step1Title', descKey: 'about.step1Desc' },
  { num: '2', titleKey: 'about.step2Title', descKey: 'about.step2Desc' },
  { num: '3', titleKey: 'about.step3Title', descKey: 'about.step3Desc' },
];

export default function AboutPage() {
  const { t } = useTranslation();

  return (
    <>
      {/* Page Hero */}
      <section className="bg-brand-blue pt-24 pb-12 md:pt-28 md:pb-16">
        <div className="max-w-[700px] mx-auto px-4 text-center">
          <span className="hero-badge inline-block text-brand-yellow font-heading font-bold text-[11px] uppercase tracking-wider mb-3">
            {t('about.pageLabel')}
          </span>
          <h1 className="hero-heading text-[28px] md:text-4xl font-heading font-bold text-white">
            {t('about.heading')}
          </h1>
          <p className="hero-subheading text-white/80 font-body text-base max-w-[550px] mx-auto mt-3">
            {t('about.subheading')}
          </p>
        </div>
      </section>

      {/* Our Story */}
      <section className="bg-white py-12 md:py-16">
        <div className="max-w-[1200px] mx-auto px-4 md:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-start">
            <div className="reveal">
              <img
                src={asset('/assets/bucket-head-setup.jpg')}
                alt="Bucket Head setup"
                className="w-full rounded-xl shadow-[0_2px_8px_rgba(0,0,0,0.08)] object-cover aspect-[4/3]"
              />
            </div>
            <div>
              <h2 className="reveal text-2xl md:text-3xl font-heading font-bold text-brand-blue mb-4">
                {t('about.storyHeading')}
              </h2>
              <div className="space-y-4">
                <p className="reveal reveal-delay-1 text-[#1A1A1A] font-body text-base leading-[1.7]">
                  {t('about.storyP1')}
                </p>
                <p className="reveal reveal-delay-2 text-[#1A1A1A] font-body text-base leading-[1.7]">
                  {t('about.storyP2')}
                </p>
                <p className="reveal reveal-delay-3 text-[#1A1A1A] font-body text-base leading-[1.7]">
                  {t('about.storyP3')}
                </p>
              </div>
              <div className="reveal mt-5">
                <TrustBadge size="lg" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* What Makes Us Different */}
      <section className="bg-[#F5F5F5] py-12 md:py-16">
        <div className="max-w-[1200px] mx-auto px-4 md:px-6 lg:px-8">
          <SectionHeader
            label={t('about.diffLabel')}
            heading={t('about.diffHeading')}
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {differentiators.map((d, i) => (
              <div
                key={i}
                className={`reveal reveal-delay-${i} bg-white rounded-xl p-6 shadow-[0_2px_8px_rgba(0,0,0,0.08)] text-center`}
              >
                <d.icon size={40} className="text-brand-blue mx-auto mb-3" />
                <h3 className="font-heading font-bold text-base text-brand-blue mb-2">
                  {t(d.titleKey)}
                </h3>
                <p className="text-sm text-[#6B7280] font-body">
                  {t(d.descKey)}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Process */}
      <section className="bg-white py-12 md:py-16">
        <div className="max-w-[1200px] mx-auto px-4 md:px-6 lg:px-8">
          <SectionHeader
            label={t('about.processLabel')}
            heading={t('about.processHeading')}
          />
          <div className="flex flex-col md:flex-row items-start justify-center gap-8 md:gap-4 max-w-[800px] mx-auto">
            {steps.map((step, i) => (
              <div key={i} className="flex-1 flex md:flex-col items-center gap-4 md:text-center md:gap-4 relative">
                {/* Connecting line - desktop */}
                {i < steps.length - 1 && (
                  <div className="hidden md:block absolute top-6 left-[calc(50%+24px)] right-[calc(-50%+24px)] h-0.5 border-t-2 border-dashed border-brand-yellow" />
                )}
                {/* Connecting line - mobile */}
                {i < steps.length - 1 && (
                  <div className="md:hidden absolute left-6 top-12 bottom-[-32px] w-0.5 border-l-2 border-dashed border-brand-yellow" />
                )}
                <div className="reveal flex-shrink-0 w-12 h-12 rounded-full bg-brand-blue flex items-center justify-center z-[1]">
                  <span className="text-white font-heading font-bold text-xl">{step.num}</span>
                </div>
                <div className="reveal reveal-delay-1">
                  <h4 className="font-heading font-bold text-base text-brand-blue mb-1">
                    {t(step.titleKey)}
                  </h4>
                  <p className="text-sm text-[#6B7280] font-body leading-relaxed">
                    {t(step.descKey)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-brand-blue py-12 md:py-16">
        <div className="max-w-[600px] mx-auto px-4 text-center">
          <h2 className="reveal text-2xl md:text-3xl font-heading font-bold text-white mb-3">
            {t('about.ctaHeading')}
          </h2>
          <p className="reveal reveal-delay-1 text-white/85 font-body text-base mb-6">
            {t('about.ctaDesc')}
          </p>
          <div className="reveal reveal-delay-2 flex justify-center">
            <CTAButtonGroup />
          </div>
        </div>
      </section>
    </>
  );
}
