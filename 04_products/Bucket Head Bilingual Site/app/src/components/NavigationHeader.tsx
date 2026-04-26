import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Menu, X } from 'lucide-react';
import { asset } from '@/lib/asset';

const navLinks = [
  { key: 'services', path: '/services' },
  { key: 'gallery', path: '/gallery' },
  { key: 'reviews', path: '/reviews' },
  { key: 'serviceArea', path: '/contact' },
  { key: 'about', path: '/about' },
];

export default function NavigationHeader() {
  const { t, i18n } = useTranslation();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const currentLang = i18n.language;

  const toggleLang = () => {
    i18n.changeLanguage(currentLang === 'en' ? 'es' : 'en');
  };

  return (
    <header className="bg-brand-blue sticky top-0 z-50 h-[192px]">
      <div className="max-w-[1200px] mx-auto px-4 md:px-6 lg:px-8 h-full flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center flex-shrink-0">
          <img
            src={asset('/assets/bucket-head-logo.png')}
            alt="Bucket Head Pressure Washing"
            className="h-40 md:h-[176px] w-auto object-contain mix-blend-lighten"
          />
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden lg:flex items-center gap-1">
          {navLinks.map((link) => {
            const isActive = location.pathname === link.path;
            return (
              <Link
                key={link.key}
                to={link.path}
                className={`px-3 py-2 text-sm font-heading font-medium uppercase tracking-wide text-white relative group transition-colors hover:text-brand-yellow ${
                  isActive ? 'text-brand-yellow' : ''
                }`}
              >
                {t(`nav.${link.key}`)}
                <span
                  className={`absolute bottom-0 left-3 right-3 h-0.5 bg-brand-yellow transition-transform origin-left ${
                    isActive ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'
                  }`}
                />
              </Link>
            );
          })}
        </nav>

        {/* Right side: Language toggle + Mobile menu button */}
        <div className="flex items-center gap-3">
          {/* Language toggle - desktop */}
          <button
            onClick={toggleLang}
            aria-label={currentLang === 'en' ? 'Switch to Spanish' : 'Switch to English'}
            className="hidden lg:flex items-center border border-white/30 rounded-full overflow-hidden"
          >
            <span
              className={`px-3 py-1 text-xs font-heading font-bold transition-colors ${
                currentLang === 'en'
                  ? 'bg-brand-yellow text-brand-blue'
                  : 'bg-transparent text-white'
              }`}
            >
              EN
            </span>
            <span
              className={`px-3 py-1 text-xs font-heading font-bold transition-colors ${
                currentLang === 'es'
                  ? 'bg-brand-yellow text-brand-blue'
                  : 'bg-transparent text-white'
              }`}
            >
              ES
            </span>
          </button>

          {/* Language toggle - mobile */}
          <button
            onClick={toggleLang}
            aria-label={currentLang === 'en' ? 'Switch to Spanish' : 'Switch to English'}
            className="lg:hidden text-white text-xs font-heading font-bold border border-white/30 rounded-full px-2 py-1"
          >
            {currentLang === 'en' ? 'ES' : 'EN'}
          </button>

          {/* Mobile hamburger */}
          <button
            className="lg:hidden text-white p-1"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile menu dropdown */}
      {menuOpen && (
        <>
          <div
            className="fixed inset-0 bg-black/40 z-40 lg:hidden"
            onClick={() => setMenuOpen(false)}
          />
          <div className="lg:hidden bg-brand-blue border-t border-white/10 relative z-50">
            <nav className="flex flex-col py-2">
              {navLinks.map((link) => (
                <Link
                  key={link.key}
                  to={link.path}
                  onClick={() => setMenuOpen(false)}
                  className={`px-6 py-4 text-white font-heading font-medium uppercase tracking-wide text-sm border-b border-white/10 hover:bg-white/5 ${
                    location.pathname === link.path ? 'text-brand-yellow' : ''
                  }`}
                >
                  {t(`nav.${link.key}`)}
                </Link>
              ))}
            </nav>
          </div>
        </>
      )}
    </header>
  );
}
