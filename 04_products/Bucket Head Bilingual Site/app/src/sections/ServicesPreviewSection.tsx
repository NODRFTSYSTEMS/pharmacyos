import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import SectionHeader from '@/components/SectionHeader';
import ServiceCard from '@/components/ServiceCard';
import { asset } from '@/lib/asset';

const vehicleServices = [
  {
    image: asset('/assets/service-exterior-wash.jpg'),
    titleKey: 'home.services.exteriorWash',
    descKey: 'home.services.exteriorWashDesc',
    price: 'Starting at $69',
  },
  {
    image: asset('/assets/service-interior-detail.jpg'),
    titleKey: 'home.services.interiorDetail',
    descKey: 'home.services.interiorDetailDesc',
    price: 'Starting at $79',
  },
  {
    image: asset('/assets/service-full-detail.jpg'),
    titleKey: 'home.services.fullDetail',
    descKey: 'home.services.fullDetailDesc',
    price: 'Starting at $149',
  },
];

const residentialServices = [
  {
    image: asset('/assets/service-driveway.jpg'),
    titleKey: 'home.services.drivewaySidewalk',
    descKey: 'home.services.drivewaySidewalkDesc',
    price: 'Starting at $149',
  },
  {
    image: asset('/assets/service-house-wash.jpg'),
    titleKey: 'home.services.houseWash',
    descKey: 'home.services.houseWashDesc',
    price: 'Starting at $249',
  },
  {
    image: asset('/assets/service-deck-patio.jpg'),
    titleKey: 'home.services.deckPatio',
    descKey: 'home.services.deckPatioDesc',
    price: 'Starting at $149',
  },
];

export default function ServicesPreviewSection() {
  const { t } = useTranslation();

  return (
    <section className="bg-[#F5F5F5] py-12 md:py-16">
      <div className="max-w-[1200px] mx-auto px-4 md:px-6 lg:px-8">
        <SectionHeader
          label={t('home.services.label')}
          heading={t('home.services.heading')}
        />

        {/* Vehicle Services */}
        <div className="mb-10">
          <div className="reveal flex items-center gap-3 mb-3">
            <div className="w-1 h-7 bg-brand-yellow rounded-full" />
            <h3 className="text-brand-blue font-heading font-bold text-sm uppercase tracking-wide">
              {t('home.services.vehicleHeader')}
            </h3>
          </div>
          <p className="reveal reveal-delay-1 text-[#6B7280] font-body text-[15px] max-w-[600px] mb-6">
            {t('home.services.vehicleDesc')}
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {vehicleServices.map((s, i) => (
              <div key={i} className={`reveal reveal-delay-${i + 1}`}>
                <ServiceCard
                  image={s.image}
                  category={t('home.services.vehicle')}
                  title={t(s.titleKey)}
                  description={t(s.descKey)}
                  price={s.price}
                  link="/services"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Residential Services */}
        <div>
          <div className="reveal flex items-center gap-3 mb-3">
            <div className="w-1 h-7 bg-brand-yellow rounded-full" />
            <h3 className="text-brand-blue font-heading font-bold text-sm uppercase tracking-wide">
              {t('home.services.residentialHeader')}
            </h3>
          </div>
          <p className="reveal reveal-delay-1 text-[#6B7280] font-body text-[15px] max-w-[600px] mb-6">
            {t('home.services.residentialDesc')}
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {residentialServices.map((s, i) => (
              <div key={i} className={`reveal reveal-delay-${i + 1}`}>
                <ServiceCard
                  image={s.image}
                  category={t('home.services.residential')}
                  title={t(s.titleKey)}
                  description={t(s.descKey)}
                  price={s.price}
                  link="/services"
                />
              </div>
            ))}
          </div>
        </div>

        <div className="reveal text-center mt-8">
          <Link
            to="/services"
            className="text-brand-blue font-heading font-semibold text-base hover:underline"
          >
            {t('home.services.seeAll')}
          </Link>
        </div>
      </div>
    </section>
  );
}
