import { useTranslation } from 'react-i18next';
import { Star } from 'lucide-react';
import ReviewCard from '@/components/ReviewCard';

const reviews = [
  { textKey: 'home.reviews.review1', authorKey: 'home.reviews.review1Author' },
  { textKey: 'home.reviews.review2', authorKey: 'home.reviews.review2Author' },
  { textKey: 'home.reviews.review3', authorKey: 'home.reviews.review3Author' },
  { textKey: 'reviews.review4', authorKey: 'reviews.review4Author' },
  { textKey: 'reviews.review5', authorKey: 'reviews.review5Author' },
  { textKey: 'reviews.review6', authorKey: 'reviews.review6Author' },
  { textKey: 'reviews.review7', authorKey: 'reviews.review7Author' },
  { textKey: 'reviews.review8', authorKey: 'reviews.review8Author' },
  { textKey: 'reviews.review9', authorKey: 'reviews.review9Author' },
];

export default function ReviewsPage() {
  const { t } = useTranslation();

  return (
    <>
      {/* Page Hero */}
      <section className="bg-brand-blue pt-24 pb-12 md:pt-28 md:pb-16">
        <div className="max-w-[700px] mx-auto px-4 text-center">
          {/* Rating summary */}
          <div className="reveal flex items-center justify-center gap-3 mb-4">
            <div className="flex gap-0.5">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  size={24}
                  className="star-animate text-brand-yellow fill-brand-yellow"
                  style={{ animationDelay: `${i * 80}ms` }}
                />
              ))}
            </div>
            <span className="text-white font-heading font-bold text-4xl">5.0</span>
          </div>
          <p className="reveal text-white/70 text-sm font-body mb-4">
            {t('reviews.ratingSummary')}
          </p>
          <h1 className="reveal text-[28px] md:text-4xl font-heading font-bold text-white mt-4">
            {t('reviews.heading')}
          </h1>
          <p className="reveal reveal-delay-1 text-white/80 font-body text-base max-w-[550px] mx-auto mt-3">
            {t('reviews.subheading')}
          </p>
        </div>
      </section>

      {/* Reviews Grid */}
      <section className="bg-[#F5F5F5] py-12 md:py-16">
        <div className="max-w-[1200px] mx-auto px-4 md:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {reviews.map((review, i) => (
              <div key={i} className={`reveal reveal-delay-${Math.min(i, 5)}`}>
                <ReviewCard
                  text={t(review.textKey)}
                  author={t(review.authorKey)}
                  expanded
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Google Review CTA */}
      <section className="bg-white py-12">
        <div className="max-w-[600px] mx-auto px-4 text-center">
          <h3 className="reveal text-xl md:text-2xl font-heading font-bold text-dark-blue mb-3">
            {t('reviews.loveService')}
          </h3>
          <p className="reveal reveal-delay-1 text-[#6B7280] font-body text-[15px] mb-4">
            {t('reviews.loveServiceDesc')}
          </p>
          <a
            href="https://g.page/r/YOUR_GOOGLE_REVIEW_LINK"
            target="_blank"
            rel="noopener noreferrer"
            className="reveal reveal-delay-2 inline-flex items-center justify-center border-2 border-brand-blue text-brand-blue font-heading font-semibold text-[15px] px-7 py-3 rounded-lg hover:bg-brand-blue hover:text-white transition-all"
          >
            {t('reviews.leaveReview')}
          </a>

          <div className="mt-8 pt-8 border-t border-gray-200">
            <div className="flex items-center justify-center gap-2 mb-2">
              <span className="text-brand-blue font-heading font-semibold text-sm">
                {t('reviews.findOnGoogle')}
              </span>
            </div>
            <p className="text-[#6B7280] font-body text-[13px]">
              {t('reviews.googleBusiness')}
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
