import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import SectionHeader from '@/components/SectionHeader';
import ReviewCard from '@/components/ReviewCard';

const reviews = [
  { textKey: 'home.reviews.review1', authorKey: 'home.reviews.review1Author' },
  { textKey: 'home.reviews.review2', authorKey: 'home.reviews.review2Author' },
  { textKey: 'home.reviews.review3', authorKey: 'home.reviews.review3Author' },
];

export default function ReviewsPreviewSection() {
  const { t } = useTranslation();

  return (
    <section className="bg-white py-12 md:py-16">
      <div className="max-w-[1200px] mx-auto px-4 md:px-6 lg:px-8">
        <SectionHeader
          label={t('home.reviews.label')}
          heading={t('home.reviews.heading')}
        />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {reviews.map((review, i) => (
            <div key={i} className={`reveal reveal-delay-${i}`}>
              <ReviewCard
                text={t(review.textKey)}
                author={t(review.authorKey)}
              />
            </div>
          ))}
        </div>
        <div className="reveal text-center mt-6">
          <Link
            to="/reviews"
            className="text-brand-blue font-heading font-semibold text-base hover:underline"
          >
            {t('home.reviews.readAll')}
          </Link>
        </div>
      </div>
    </section>
  );
}
