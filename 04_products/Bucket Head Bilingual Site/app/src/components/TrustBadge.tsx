import { useTranslation } from 'react-i18next';
import { CheckCircle } from 'lucide-react';

interface TrustBadgeProps {
  size?: 'sm' | 'lg';
  light?: boolean;
}

export default function TrustBadge({ size = 'sm', light = false }: TrustBadgeProps) {
  const { t } = useTranslation();
  const textSize = size === 'lg' ? 'text-base' : 'text-sm';

  return (
    <div className={`flex items-center gap-2 ${light ? 'justify-center' : ''}`}>
      <CheckCircle size={size === 'lg' ? 20 : 16} className="text-success flex-shrink-0" />
      <span className={`font-heading font-semibold text-success ${textSize}`}>
        {t('trust.licensedInsured')}
      </span>
      <span className={`text-[#6B7280] font-body ${textSize}`}>
        {t('trust.gwinnettCounty')}
      </span>
    </div>
  );
}
