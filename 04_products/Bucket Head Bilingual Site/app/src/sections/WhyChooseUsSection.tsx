import { useTranslation } from 'react-i18next';
import SectionHeader from '@/components/SectionHeader';
import { asset } from '@/lib/asset';

const steps = [
  { num: '1', titleKey: 'home.whyChooseUs.step1Title', descKey: 'home.whyChooseUs.step1Desc' },
  { num: '2', titleKey: 'home.whyChooseUs.step2Title', descKey: 'home.whyChooseUs.step2Desc' },
  { num: '3', titleKey: 'home.whyChooseUs.step3Title', descKey: 'home.whyChooseUs.step3Desc' },
];

export default function WhyChooseUsSection() {
  const { t } = useTranslation();

  return (
    <section className="bg-white py-12 md:py-16">
      <div className="max-w-[1200px] mx-auto px-4 md:px-6 lg:px-8">
        <SectionHeader
          label={t('home.whyChooseUs.label')}
          heading={t('home.whyChooseUs.heading')}
        />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-start">
          {/* Image */}
          <div className="reveal">
            <img
              src={asset('/assets/bucket-head-setup.jpg')}
              alt="Bucket Head mobile setup"
              className="w-full rounded-xl shadow-[0_2px_8px_rgba(0,0,0,0.08)] object-cover aspect-[4/3]"
            />
          </div>
          {/* Steps */}
          <div className="space-y-5">
            {steps.map((step, i) => (
              <div key={i} className={`reveal reveal-delay-${i + 1} flex gap-4`}>
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-brand-yellow flex items-center justify-center">
                  <span className="text-brand-blue font-heading font-bold text-sm">{step.num}</span>
                </div>
                <div>
                  <h4 className="font-heading font-bold text-base text-[#1A1A1A] mb-1">
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
      </div>
    </section>
  );
}
