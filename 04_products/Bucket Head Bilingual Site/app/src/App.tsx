import { BrowserRouter, Routes, Route } from 'react-router-dom';
import PageLayout from '@/components/PageLayout';
import HomePage from '@/pages/HomePage';
import ServicesPage from '@/pages/ServicesPage';
import GalleryPage from '@/pages/GalleryPage';
import ReviewsPage from '@/pages/ReviewsPage';
import ContactPage from '@/pages/ContactPage';
import AboutPage from '@/pages/AboutPage';

function App() {
  return (
    <BrowserRouter basename="/bucket-head-pressure-washing">
      <PageLayout>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/services" element={<ServicesPage />} />
          <Route path="/gallery" element={<GalleryPage />} />
          <Route path="/reviews" element={<ReviewsPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/about" element={<AboutPage />} />
        </Routes>
      </PageLayout>
    </BrowserRouter>
  );
}

export default App;
