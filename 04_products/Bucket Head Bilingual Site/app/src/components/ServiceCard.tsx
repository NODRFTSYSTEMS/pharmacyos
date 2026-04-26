import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

interface ServiceCardProps {
  image: string;
  category: string;
  title: string;
  description: string;
  price?: string;
  link?: string;
}

export default function ServiceCard({ image, category, title, description, price, link = '/services' }: ServiceCardProps) {
  const { t } = useTranslation();
  return (
    <Link
      to={link}
      className="group bg-white rounded-xl shadow-[0_2px_8px_rgba(0,0,0,0.08)] hover:shadow-[0_4px_16px_rgba(0,0,0,0.12)] hover:-translate-y-1 transition-all duration-200 overflow-hidden block"
    >
      <div className="aspect-video overflow-hidden">
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-200"
        />
      </div>
      <div className="p-5">
        <span className="inline-block px-2.5 py-0.5 bg-brand-yellow text-brand-blue text-[11px] font-heading font-semibold uppercase rounded-full mb-2">
          {category}
        </span>
        <h3 className="text-lg font-heading font-bold text-[#1A1A1A] mb-1">{title}</h3>
        {price && (
          <p className="text-brand-blue font-heading font-bold text-sm mb-1">{price}</p>
        )}
        <p className="text-sm text-[#6B7280] font-body line-clamp-2 mb-3">{description}</p>
        <span className="text-sm font-heading font-semibold text-brand-blue group-hover:underline">
          {t('home.services.learnMore')}
        </span>
      </div>
    </Link>
  );
}
