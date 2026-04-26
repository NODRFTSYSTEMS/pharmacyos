import { useEffect } from 'react';

export function useScrollReveal(routeKey: string, threshold = 0.15) {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('revealed');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold, rootMargin: '0px 0px -30px 0px' }
    );

    // Small delay to let React finish rendering the new route
    const timer = setTimeout(() => {
      document.querySelectorAll('.reveal').forEach((el) => {
        el.classList.remove('revealed');
        observer.observe(el);
      });
    }, 50);

    return () => {
      clearTimeout(timer);
      observer.disconnect();
    };
  }, [routeKey, threshold]);
}
