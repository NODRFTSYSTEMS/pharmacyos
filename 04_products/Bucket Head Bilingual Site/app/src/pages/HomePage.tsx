import HeroSection from '@/sections/HeroSection';
import TrustStrip from '@/sections/TrustStrip';
import ServicesPreviewSection from '@/sections/ServicesPreviewSection';
import WhyChooseUsSection from '@/sections/WhyChooseUsSection';
import RecentWorkPreviewSection from '@/sections/RecentWorkPreviewSection';
import ReviewsPreviewSection from '@/sections/ReviewsPreviewSection';
import ServiceAreaPreviewSection from '@/sections/ServiceAreaPreviewSection';

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <TrustStrip />
      <ServicesPreviewSection />
      <WhyChooseUsSection />
      <RecentWorkPreviewSection />
      <ReviewsPreviewSection />
      <ServiceAreaPreviewSection />
    </>
  );
}
