import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import SectionHeader from '@/components/SectionHeader';
import { asset } from '@/lib/asset';

const images = [
  { src: asset('/assets/gallery-preview-1.jpg'), alt: 'Driveway before and after' },
  { src: asset('/assets/gallery-preview-2.jpg'), alt: 'Detailed car exterior' },
  { src: asset('/assets/gallery-preview-3.jpg'), alt: 'Clean house siding' },
  { src: asset('/assets/gallery-preview-4.jpg'), alt: 'Clean deck' },
];

export default function RecentWorkPreviewSection() {
  const { t } = useTranslation();

  return (
    <section className="bg-light-blue py-12 md:py-16">
      <div className="max-w-[1200px] mx-auto px-4 md:px-6 lg:px-8">
        <SectionHeader
          label={t('home.recentWork.label')}
          heading={t('home.recentWork.heading')}
        />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {images.map((img, i) => (
            <Link
              to="/gallery"
              key={i}
              className={`reveal reveal-delay-${i} group aspect-square rounded-lg overflow-hidden block`}
            >
              <img
                src={img.src}
                alt={img.alt}
                className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-200"
              />
            </Link>
          ))}
        </div>
        <div className="reveal text-center mt-6">
          <Link
            to="/gallery"
            className="inline-flex items-center justify-center bg-brand-blue text-white font-heading font-bold text-base px-8 py-3.5 rounded-lg shadow-[0_2px_4px_rgba(0,0,0,0.15)] hover:brightness-110 transition-all"
          >
            {t('home.recentWork.viewGallery')}
          </Link>
        </div>
      </div>
    </section>
  );
}
