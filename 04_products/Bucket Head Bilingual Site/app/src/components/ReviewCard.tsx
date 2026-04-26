import { Star } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface ReviewCardProps {
  text: string;
  author: string;
  expanded?: boolean;
}

export default function ReviewCard({ text, author, expanded = false }: ReviewCardProps) {
  const { t } = useTranslation();
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-5 h-full flex flex-col">
      <div className="flex gap-0.5 mb-3">
        {[...Array(5)].map((_, i) => (
          <Star key={i} size={16} className="text-brand-yellow fill-brand-yellow" />
        ))}
      </div>
      <p className={`text-sm text-[#1A1A1A] font-body italic flex-1 ${expanded ? 'line-clamp-5' : 'line-clamp-3'}`}>
        "{text}"
      </p>
      <div className="mt-4 pt-3 border-t border-gray-100">
        <p className="text-[13px] font-body font-medium text-[#6B7280]">{author}</p>
        <div className="flex items-center gap-1.5 mt-1">
          <span className="text-[11px] text-[#6B7280] font-body">{t('reviews.googleReview')}</span>
        </div>
      </div>
    </div>
  );
}
