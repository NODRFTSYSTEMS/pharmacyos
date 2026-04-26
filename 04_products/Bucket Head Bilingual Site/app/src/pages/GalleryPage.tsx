import { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { PHONE_LINK } from '@/lib/constants';
import { asset } from '@/lib/asset';

type Category = 'all' | 'vehicle' | 'residential';

interface GalleryItem {
  src: string;
  alt: string;
  category: Category;
}

const galleryItems: GalleryItem[] = [
  { src: asset('/assets/gallery-v1.jpg'), alt: 'Car exterior before and after', category: 'vehicle' },
  { src: asset('/assets/gallery-v2.jpg'), alt: 'Clean wheel and tire', category: 'vehicle' },
  { src: asset('/assets/service-exterior-wash.jpg'), alt: 'Car wash water beading', category: 'vehicle' },
  { src: asset('/assets/service-full-detail.jpg'), alt: 'Full detail result', category: 'vehicle' },
  { src: asset('/assets/gallery-preview-1.jpg'), alt: 'Driveway before and after', category: 'residential' },
  { src: asset('/assets/gallery-preview-3.jpg'), alt: 'Clean house siding', category: 'residential' },
  { src: asset('/assets/gallery-r1.jpg'), alt: 'Patio pressure washing', category: 'residential' },
  { src: asset('/assets/gallery-r2.jpg'), alt: 'Deck restoration', category: 'residential' },
  { src: asset('/assets/service-driveway-detail.jpg'), alt: 'Driveway cleaning in action', category: 'residential' },
  { src: asset('/assets/service-house-detail.jpg'), alt: 'House wash', category: 'residential' },
  { src: asset('/assets/service-deck-detail.jpg'), alt: 'Deck cleaning result', category: 'residential' },
  { src: asset('/assets/bucket-head-setup.jpg'), alt: 'Mobile setup', category: 'residential' },
];

const filters: { key: Category; labelKey: string }[] = [
  { key: 'all', labelKey: 'gallery.filterAll' },
  { key: 'vehicle', labelKey: 'gallery.filterVehicle' },
  { key: 'residential', labelKey: 'gallery.filterResidential' },
];

export default function GalleryPage() {
  const { t } = useTranslation();
  const [activeFilter, setActiveFilter] = useState<Category>('all');
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  const filteredItems = activeFilter === 'all'
    ? galleryItems
    : galleryItems.filter((item) => item.category === activeFilter);

  const openLightbox = (index: number) => {
    setLightboxIndex(index);
    setLightboxOpen(true);
    document.documentElement.style.overflow = 'hidden';
  };

  const closeLightbox = useCallback(() => {
    setLightboxOpen(false);
    document.documentElement.style.overflow = '';
  }, []);

  const goNext = useCallback(() => {
    setLightboxIndex((prev) => (prev + 1) % filteredItems.length);
  }, [filteredItems.length]);

  const goPrev = useCallback(() => {
    setLightboxIndex((prev) => (prev - 1 + filteredItems.length) % filteredItems.length);
  }, [filteredItems.length]);

  // Keyboard navigation
  useEffect(() => {
    if (!lightboxOpen) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowRight') goNext();
      if (e.key === 'ArrowLeft') goPrev();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [lightboxOpen, closeLightbox, goNext, goPrev]);

  return (
    <>
      {/* Page Hero */}
      <section className="bg-brand-blue pt-24 pb-12 md:pt-28 md:pb-16">
        <div className="max-w-[700px] mx-auto px-4 text-center">
          <span className="hero-badge inline-block text-brand-yellow font-heading font-bold text-[11px] uppercase tracking-wider mb-3">
            {t('gallery.pageLabel')}
          </span>
          <h1 className="hero-heading text-[28px] md:text-4xl font-heading font-bold text-white">
            {t('gallery.heading')}
          </h1>
          <p className="hero-subheading text-white/80 font-body text-base max-w-[550px] mx-auto mt-3">
            {t('gallery.subheading')}
          </p>
        </div>
      </section>

      {/* Filter + Grid */}
      <section className="bg-[#F5F5F5] py-8 md:py-12">
        <div className="max-w-[1200px] mx-auto px-4 md:px-6 lg:px-8">
          {/* Filter tabs */}
          <div className="reveal flex justify-center mb-6">
            <div className="inline-flex bg-white border border-gray-200 rounded-full p-1 gap-1">
              {filters.map((f) => (
                <button
                  key={f.key}
                  onClick={() => setActiveFilter(f.key)}
                  className={`px-4 py-2 rounded-full text-sm font-heading font-semibold transition-all ${
                    activeFilter === f.key
                      ? 'bg-brand-blue text-white'
                      : 'text-brand-blue hover:bg-gray-50'
                  }`}
                >
                  {t(f.labelKey)}
                </button>
              ))}
            </div>
          </div>

          {/* Photo grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {filteredItems.map((item, i) => (
              <button
                key={item.src + activeFilter}
                onClick={() => openLightbox(i)}
                className={`reveal reveal-delay-${Math.min(i, 5)} group relative aspect-[4/3] rounded-lg overflow-hidden cursor-pointer block w-full`}
              >
                <img
                  src={item.src}
                  alt={item.alt}
                  className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-200"
                />
                <div className="absolute inset-0 bg-brand-blue/0 group-hover:bg-brand-blue/60 transition-colors duration-200 flex items-center justify-center">
                  <span className="text-white text-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    🔍
                  </span>
                </div>
                <span className={`absolute top-0 right-0 text-[10px] font-heading font-semibold uppercase px-2 py-0.5 rounded-bl-lg ${
                  item.category === 'vehicle'
                    ? 'bg-brand-yellow text-brand-blue'
                    : 'bg-brand-blue text-white'
                }`}>
                  {item.category === 'vehicle' ? t('home.services.vehicle') : t('home.services.residential')}
                </span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="bg-brand-yellow py-8">
        <div className="max-w-[600px] mx-auto px-4 text-center">
          <h3 className="reveal text-xl md:text-2xl font-heading font-bold text-brand-blue mb-4">
            {t('gallery.ctaHeading')}
          </h3>
          <a
            href={PHONE_LINK}
            className="reveal reveal-delay-1 inline-flex items-center justify-center bg-brand-blue text-white font-heading font-bold text-base px-8 py-3.5 rounded-lg hover:brightness-110 transition-all"
          >
            {t('gallery.ctaButton')}
          </a>
        </div>
      </section>

      {/* Lightbox */}
      {lightboxOpen && (
        <div
          className="fixed inset-0 z-[2000] bg-black/95 flex items-center justify-center"
          onClick={closeLightbox}
        >
          {/* Close button */}
          <button
            onClick={closeLightbox}
            aria-label="Close lightbox"
            className="absolute top-4 right-4 text-white/80 hover:text-white z-10 p-2"
          >
            <X size={28} />
          </button>

          {/* Prev */}
          <button
            onClick={(e) => { e.stopPropagation(); goPrev(); }}
            aria-label="Previous image"
            className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/50 flex items-center justify-center text-white hover:bg-black/70 transition-colors z-10"
          >
            <ChevronLeft size={24} />
          </button>

          {/* Next */}
          <button
            onClick={(e) => { e.stopPropagation(); goNext(); }}
            aria-label="Next image"
            className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/50 flex items-center justify-center text-white hover:bg-black/70 transition-colors z-10"
          >
            <ChevronRight size={24} />
          </button>

          {/* Image */}
          <div
            className="max-w-[90vw] max-h-[80vh]"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={filteredItems[lightboxIndex].src}
              alt={filteredItems[lightboxIndex].alt}
              className="max-w-full max-h-[80vh] object-contain rounded"
            />
            <p className="text-center text-white/70 text-sm mt-4 font-body">
              {lightboxIndex + 1} {t('lightbox.of')} {filteredItems.length}
            </p>
          </div>
        </div>
      )}
    </>
  );
}
