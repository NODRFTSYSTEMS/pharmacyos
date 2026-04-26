import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { PHONE_NUMBER, PHONE_NUMBER_2, PHONE_LINK, PHONE_LINK_2, EMAIL } from '@/lib/constants';
import { CheckCircle } from 'lucide-react';

const quickLinks = [
  { key: 'services', path: '/services' },
  { key: 'gallery', path: '/gallery' },
  { key: 'reviews', path: '/reviews' },
  { key: 'serviceArea', path: '/contact' },
  { key: 'about', path: '/about' },
];

export default function Footer() {
  const { t } = useTranslation();

  return (
    <footer className="bg-dark-blue text-white">
      <div className="max-w-[1200px] mx-auto px-4 md:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {/* Contact */}
          <div>
            <h3 className="text-brand-yellow font-heading font-bold text-xs uppercase tracking-wider mb-4">
              {t('footer.getInTouch')}
            </h3>
            <a
              href={PHONE_LINK}
              className="block text-white font-heading font-bold text-2xl hover:text-brand-yellow transition-colors mb-1"
            >
              {PHONE_NUMBER}
            </a>
            <a
              href={PHONE_LINK_2}
              className="block text-white font-heading font-bold text-lg hover:text-brand-yellow transition-colors mb-3"
            >
              {PHONE_NUMBER_2}
            </a>
            <a
              href={`mailto:${EMAIL}`}
              className="block text-white/70 text-sm font-body hover:text-brand-yellow transition-colors mb-2"
            >
              {EMAIL}
            </a>
            <p className="text-white/70 text-sm font-body mb-1">
              {t('cta.callOrText')}
            </p>
            <p className="text-white/60 text-sm font-body">
              {t('trust.gwinnettCounty')}
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-brand-yellow font-heading font-bold text-xs uppercase tracking-wider mb-4">
              {t('footer.quickLinks')}
            </h3>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.key}>
                  <Link
                    to={link.path}
                    className="text-white font-body text-sm hover:underline transition-all"
                  >
                    {t(`nav.${link.key}`)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Business Info */}
          <div>
            <h3 className="text-white font-heading font-bold text-base mb-1">
              Bucket Head Pressure Washing
            </h3>
            <p className="text-brand-yellow font-body text-sm italic mb-3">
              {t('footer.tagline')}
            </p>
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle size={16} className="text-success flex-shrink-0" />
              <span className="text-success font-heading font-semibold text-sm">
                {t('trust.licensedInsured')}
              </span>
            </div>
            <p className="text-white/60 text-sm font-body mb-1">
              {t('footer.mobileCarWash')}
            </p>
            <p className="text-white/60 text-sm font-body">
              {t('footer.servingSince')}
            </p>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-10 pt-6 border-t border-white/10 text-center">
          <p className="text-white/40 font-body text-xs">
            {t('footer.allRights')}
          </p>
          <p className="text-white/20 font-body text-xs mt-1">
            Built by{' '}
            <a
              href="https://nodrftsystems.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white/40 transition-colors"
            >
              NODRFTSYSTEMS.com
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
