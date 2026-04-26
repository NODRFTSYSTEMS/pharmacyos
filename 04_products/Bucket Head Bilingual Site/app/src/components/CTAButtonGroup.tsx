import { useTranslation } from 'react-i18next';
import { PHONE_LINK, SMS_LINK } from '@/lib/constants';
import { Phone, MessageCircle } from 'lucide-react';

interface CTAButtonGroupProps {
  stacked?: boolean;
}

export default function CTAButtonGroup({ stacked = false }: CTAButtonGroupProps) {
  const { t } = useTranslation();

  return (
    <div className={`flex ${stacked ? 'flex-col' : 'flex-col md:flex-row'} gap-3`}>
      <a
        href={PHONE_LINK}
        className="inline-flex items-center justify-center gap-2 bg-brand-yellow text-brand-blue font-heading font-bold text-base px-8 py-4 rounded-lg shadow-[0_2px_4px_rgba(0,0,0,0.15)] hover:brightness-105 hover:-translate-y-0.5 active:translate-y-0 transition-all"
      >
        <Phone size={18} />
        {t('cta.callNowEstimate')}
      </a>
      <a
        href={SMS_LINK}
        className="inline-flex items-center justify-center gap-2 bg-white text-brand-blue font-heading font-bold text-base px-8 py-4 rounded-lg shadow-[0_2px_4px_rgba(0,0,0,0.15)] hover:brightness-95 hover:-translate-y-0.5 active:translate-y-0 transition-all"
      >
        <MessageCircle size={18} />
        {t('cta.textUsReply')}
      </a>
    </div>
  );
}
