import { useLocation } from 'react-router-dom';
import { useScrollReveal } from '@/hooks/useScrollReveal';
import NavigationHeader from './NavigationHeader';
import Footer from './Footer';
import MobileStickyCTA from './MobileStickyCTA';

interface PageLayoutProps {
  children: React.ReactNode;
}

export default function PageLayout({ children }: PageLayoutProps) {
  const { pathname } = useLocation();
  useScrollReveal(pathname);

  return (
    <div className="min-h-screen flex flex-col">
      <NavigationHeader />
      <main className="flex-1 pb-14 md:pb-0">{children}</main>
      <Footer />
      <MobileStickyCTA />
    </div>
  );
}
