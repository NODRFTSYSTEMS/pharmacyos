import { type FormEvent, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowRight, Clock, Mail, MapPin } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

type TextPosition = 'left' | 'right';

interface PinnedSectionProps {
  id?: string;
  image: string;
  imageAlt: string;
  headline: string;
  body: string;
  cta: string;
  ctaHref: string;
  textPosition: TextPosition;
  zIndex: number;
}

const STUDIO_EMAIL = 'hello@walcottpress.com';
const CONTACT_FORM_ENDPOINT = `https://formsubmit.co/${STUDIO_EMAIL}`;
const STRATEGY_CALL_HREF = '#contact';
const FRAMEWORK_HREF = '#framework';

const PROJECT_TYPES = [
  { value: 'gap-framework', label: 'Pre-Launch Gap Framework Request' },
  { value: 'visibility-system', label: 'Pre-Launch Visibility System' },
  { value: 'website', label: 'Author or Title Website' },
  { value: 'launch-content', label: 'Launch Content Production' },
  { value: 'audience-system', label: 'Audience Capture System' },
  { value: 'publisher-support', label: 'Publisher Support' },
  { value: 'other', label: 'Other' },
];

const TIMELINES = [
  { value: 'urgent', label: 'Launch is within 30 days' },
  { value: 'quarter', label: 'Launch is 1-3 months out' },
  { value: 'flexible', label: 'We have a longer runway' },
];

const PINNED_SECTIONS: PinnedSectionProps[] = [
  {
    id: 'problem',
    image: assetUrl('workspace_laptop.jpg'),
    imageAlt: 'Book launch planning workspace',
    headline: 'No audience before launch.',
    body: 'Too many books arrive before demand exists. Without pre-launch infrastructure, visibility depends on timing and luck instead of a system.',
    cta: 'See core services',
    ctaHref: '#services',
    textPosition: 'left',
    zIndex: 20,
  },
  {
    id: 'services',
    image: assetUrl('hands_paper_thread.jpg'),
    imageAlt: 'Pre-launch strategy planning',
    headline: 'Pre-Launch Visibility Systems.',
    body: 'Strategy, messaging architecture, audience pathways, and launch sequencing built before release day, not improvised during launch week.',
    cta: 'See the process',
    ctaHref: '#process',
    textPosition: 'right',
    zIndex: 30,
  },
  {
    image: assetUrl('proofing_spreads.jpg'),
    imageAlt: 'Author website planning',
    headline: 'Author and title websites.',
    body: 'Credible, conversion-ready digital homes designed to turn attention into inquiry, email capture, pre-order, or sale.',
    cta: 'See how it works',
    ctaHref: '#process',
    textPosition: 'left',
    zIndex: 40,
  },
  {
    image: assetUrl('printing_press.jpg'),
    imageAlt: 'Launch content production',
    headline: 'Launch content production.',
    body: 'Trailers, short-form content, launch assets, and platform-ready creative that carry the book into public attention without fragmenting the message.',
    cta: 'Talk through the launch',
    ctaHref: '#contact',
    textPosition: 'right',
    zIndex: 50,
  },
  {
    image: assetUrl('bindery_finishing.jpg'),
    imageAlt: 'Audience capture workflow',
    headline: 'Audience capture that converts.',
    body: 'Email capture, inquiry paths, and offer structure that keep visibility from evaporating into vanity metrics.',
    cta: 'See the conversion logic',
    ctaHref: '#process',
    textPosition: 'left',
    zIndex: 60,
  },
  {
    image: assetUrl('book_cover_present.jpg'),
    imageAlt: 'Publisher support materials',
    headline: 'Publisher support across the list.',
    body: 'White-label web assets, launch systems, and execution support for small publishers managing multiple titles at once.',
    cta: 'Discuss publisher support',
    ctaHref: '#contact',
    textPosition: 'right',
    zIndex: 70,
  },
  {
    image: assetUrl('shelf_curation.jpg'),
    imageAlt: 'Launch gap analysis',
    headline: 'Diagnose the launch gap.',
    body: 'We start by mapping what is missing between the manuscript and market visibility, so the engagement solves the structural problem first.',
    cta: 'Request a Strategy Call',
    ctaHref: STRATEGY_CALL_HREF,
    textPosition: 'left',
    zIndex: 80,
  },
  {
    image: assetUrl('reader_interior.jpg'),
    imageAlt: 'Pre-release audience planning',
    headline: 'Build the infrastructure before release.',
    body: 'Website, messaging, audience pathways, and content systems are built before the release window so launch activity has somewhere real to convert.',
    cta: 'See the Framework',
    ctaHref: FRAMEWORK_HREF,
    textPosition: 'right',
    zIndex: 90,
  },
  {
    id: 'process',
    image: assetUrl('hands_open_book.jpg'),
    imageAlt: 'Content strategy partnership',
    headline: 'Produce launch-ready content.',
    body: 'Once the system is in place, we create the assets, messaging, and page structure that turn the book into an ongoing public conversation.',
    cta: 'See the next step',
    ctaHref: '#contact',
    textPosition: 'right',
    zIndex: 100,
  },
  {
    image: assetUrl('type_blocks.jpg'),
    imageAlt: 'Conversion strategy planning',
    headline: 'Convert visibility into action.',
    body: 'Attention only matters when it leads somewhere measurable: inquiries, email subscriptions, pre-orders, sales, or long-term audience growth.',
    cta: 'Request a Strategy Call',
    ctaHref: STRATEGY_CALL_HREF,
    textPosition: 'left',
    zIndex: 110,
  },
];

const PROOF_POINTS = [
  {
    label: 'What we assess first',
    title: 'The Launch Gap Diagnostic',
    body: 'Before any website is built or content is produced, we map what is structurally missing between the manuscript and market visibility.',
  },
  {
    label: 'What we build before launch',
    title: 'Infrastructure, not just content',
    body: 'Website, messaging, audience pathways, and conversion logic are built before release so launch week has a system to operate on.',
  },
  {
    label: 'What success should create',
    title: 'Visibility that leads somewhere',
    body: 'Every asset is tied to inquiry, email capture, pre-order, sale, or audience growth so attention does not dissipate into vanity metrics.',
  },
];

const ENTRY_PATHS = [
  {
    title: 'Authors',
    body: 'You have a manuscript and a release window, but no system yet to build demand before launch.',
    cta: 'See the Gap Framework',
    href: FRAMEWORK_HREF,
  },
  {
    title: 'Publishers',
    body: 'You need repeatable launch infrastructure, web assets, and execution support across more than one title.',
    cta: 'Discuss Publisher Support',
    href: '#contact',
  },
  {
    title: 'Expert-led projects',
    body: 'You have strong subject matter and credibility, but no digital path from attention to inquiry or sale.',
    cta: 'Request a Strategy Call',
    href: STRATEGY_CALL_HREF,
  },
];

const FRAMEWORK_PILLARS = [
  {
    title: 'Positioning and message clarity',
    body: 'We identify how the book should be described, who it is for, and what the market should understand before launch week begins.',
  },
  {
    title: 'Website and conversion path',
    body: 'We review whether attention has somewhere concrete to go: inquiry, email capture, pre-order, or sale.',
  },
  {
    title: 'Audience and content sequence',
    body: 'We map what should be published, when it should go live, and how it should support demand before release.',
  },
  {
    title: 'Launch timing and execution risk',
    body: 'We surface the missing pieces that can stall launch momentum when the release window is already moving.',
  },
];

const FAQS = [
  {
    question: 'What is the Pre-Launch Gap Framework?',
    answer: 'It is a structured diagnostic that shows what is missing across positioning, website readiness, audience pathways, and launch timing before the public push begins.',
  },
  {
    question: 'When should this work start?',
    answer: 'Ideally, three to six months before release. That gives enough time to build the website, sharpen the message, capture audience interest, and sequence launch content properly.',
  },
  {
    question: 'Who is this built for?',
    answer: 'Authors, independent publishers, and expert-led book projects that need pre-release visibility infrastructure, not just a burst of launch-week activity.',
  },
];

function assetUrl(name: string) {
  return `${import.meta.env.BASE_URL}${name}`;
}

function prefersReducedMotion() {
  return typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

function shouldUsePinnedScenes() {
  return typeof window !== 'undefined'
    && window.matchMedia('(min-width: 768px)').matches
    && !prefersReducedMotion();
}

function Navigation() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const menuButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 100);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = isMobileMenuOpen ? 'hidden' : previousOverflow;

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isMobileMenuOpen]);

  useEffect(() => {
    if (!isMobileMenuOpen) return;

    const closeMenuFromSystemEvent = () => {
      setIsMobileMenuOpen(false);
      requestAnimationFrame(() => menuButtonRef.current?.focus());
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        closeMenuFromSystemEvent();
      }
    };

    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsMobileMenuOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('resize', handleResize, { passive: true });

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('resize', handleResize);
    };
  }, [isMobileMenuOpen]);

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
    requestAnimationFrame(() => menuButtonRef.current?.focus());
  };

  return (
    <nav className={`fixed left-0 top-0 z-[1000] w-full transition-[background-color,backdrop-filter] duration-500 ${isScrolled ? 'bg-paper/90 backdrop-blur-sm' : 'bg-transparent'}`}>
      <div className="flex items-center justify-between px-[7vw] py-6">
        <a href="#home" className="font-serif text-lg font-semibold tracking-tight text-ink sm:text-xl md:text-2xl">Walcott & Co. Press</a>
        <div className="hidden items-center gap-10 md:flex">
          <a href="#problem" className="link-underline font-sans text-sm text-ink">Problem</a>
          <a href="#services" className="link-underline font-sans text-sm text-ink">Services</a>
          <a href="#process" className="link-underline font-sans text-sm text-ink">Process</a>
          <a href="#framework" className="link-underline font-sans text-sm text-ink">Framework</a>
          <a href="#contact" className="link-underline font-sans text-sm text-ink">Contact</a>
          <a href={STRATEGY_CALL_HREF} className="cta-primary text-xs">Request a Strategy Call</a>
        </div>
        <button
          ref={menuButtonRef}
          type="button"
          className="p-2 focus-visible:outline focus-visible:outline-2 focus-visible:outline-gold focus-visible:outline-offset-4 md:hidden"
          onClick={() => setIsMobileMenuOpen((open) => !open)}
          aria-expanded={isMobileMenuOpen}
          aria-controls="mobile-navigation"
          aria-label={isMobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
        >
          <div className="mb-1.5 h-0.5 w-6 bg-ink"></div>
          <div className="h-0.5 w-6 bg-ink"></div>
        </button>
      </div>
      {isMobileMenuOpen ? (
        <div id="mobile-navigation" className="absolute left-0 top-full w-full border-t border-border bg-paper/95 backdrop-blur-sm md:hidden">
          <div className="flex flex-col gap-4 px-[7vw] py-6">
            <a href="#problem" className="font-sans text-lg text-ink" onClick={closeMobileMenu}>Problem</a>
            <a href="#services" className="font-sans text-lg text-ink" onClick={closeMobileMenu}>Services</a>
            <a href="#process" className="font-sans text-lg text-ink" onClick={closeMobileMenu}>Process</a>
            <a href="#framework" className="font-sans text-lg text-ink" onClick={closeMobileMenu}>Framework</a>
            <a href="#contact" className="font-sans text-lg text-ink" onClick={closeMobileMenu}>Contact</a>
            <a href={STRATEGY_CALL_HREF} className="font-sans text-lg text-gold" onClick={closeMobileMenu}>Request a Strategy Call</a>
          </div>
        </div>
      ) : null}
    </nav>
  );
}

function HeroSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    if (prefersReducedMotion()) return;

    const section = sectionRef.current;
    const image = imageRef.current;
    const content = contentRef.current;
    if (!section || !image || !content) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'power2.out' } });
      tl.fromTo(image, { x: '12vw', opacity: 0 }, { x: 0, opacity: 1, duration: 0.9 })
        .fromTo(content.querySelectorAll('.hero-headline span'), { y: 40, opacity: 0 }, { y: 0, opacity: 1, stagger: 0.05, duration: 0.8 }, '-=0.5')
        .fromTo(content.querySelectorAll('.hero-sub'), { y: 18, opacity: 0 }, { y: 0, opacity: 1, stagger: 0.08, duration: 0.6 }, '-=0.4');

      if (!shouldUsePinnedScenes()) return;

      const scrollTl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: '+=130%',
          pin: true,
          scrub: 0.6,
          onLeaveBack: () => {
            gsap.set(image, { x: 0, opacity: 1, scale: 1 });
            gsap.set(content.querySelectorAll('.hero-headline, .hero-sub, .hero-cta'), { x: 0, opacity: 1 });
          },
        },
      });

      scrollTl
        .fromTo(content.querySelectorAll('.hero-headline'), { x: 0, opacity: 1 }, { x: '-18vw', opacity: 0, ease: 'power2.in' }, 0.7)
        .fromTo(content.querySelectorAll('.hero-sub'), { x: 0, opacity: 1 }, { x: '-12vw', opacity: 0, ease: 'power2.in' }, 0.72)
        .fromTo(content.querySelectorAll('.hero-cta'), { y: 0, opacity: 1 }, { y: '6vh', opacity: 0, ease: 'power2.in' }, 0.75)
        .fromTo(image, { x: 0, scale: 1, opacity: 1 }, { x: '-10vw', scale: 1.06, opacity: 0, ease: 'power2.in' }, 0.7);
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} id="home" className="section-pinned z-10 bg-paper">
      <div ref={contentRef} className="absolute left-[7vw] top-[15vh] z-20 w-[86vw] sm:w-[72vw] md:top-[18vh] md:w-[44vw]">
        <div className="relative">
          <div className="corner-mark corner-mark-tl"></div>
          <p className="hero-sub mb-6 text-eyebrow text-gold">Book Launch Strategy, Author Websites, and Pre-Release Visibility</p>
          <h1 className="hero-headline text-balance mb-8 font-serif text-hero text-ink">
            <span className="block">Books should</span>
            <span className="block">not launch</span>
            <span className="block">into</span>
            <span className="block">silence.</span>
          </h1>
          <p className="hero-sub mb-4 max-w-xl font-sans text-base leading-relaxed text-warm-gray md:max-w-md">
            We build book launch strategy, author websites, and pre-release visibility systems that help serious books create demand before release day.
          </p>
          <p className="hero-sub mb-10 max-w-xl font-sans text-sm leading-relaxed text-warm-gray md:max-w-md">
            For authors, independent publishers, and expert-led projects that need a clear path from attention to inquiry, email capture, pre-order, or sale.
          </p>
          <div className="hero-cta flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:gap-8">
            <a href={STRATEGY_CALL_HREF} className="cta-primary">Request a Strategy Call<ArrowRight aria-hidden="true" className="h-4 w-4" /></a>
            <a href={FRAMEWORK_HREF} className="cta-secondary">See the Pre-Launch Gap Framework</a>
          </div>
          <p className="hero-sub mt-4 max-w-xl font-sans text-xs leading-relaxed text-warm-gray md:max-w-md">
            The framework is a structured review of your message, website readiness, audience path, and launch timing before release momentum is on the line.
          </p>
        </div>
      </div>
      <div ref={imageRef} className="absolute inset-0 overflow-hidden md:left-auto md:w-[52vw]">
        <img
          src={assetUrl('hero_portrait.jpg')}
          alt="Walcott editorial portrait"
          width={864}
          height={1184}
          fetchPriority="high"
          decoding="async"
          className="h-full w-full object-cover opacity-30 md:opacity-100"
        />
        <div className="absolute inset-0 bg-paper/55 md:hidden"></div>
        <div className="corner-mark corner-mark-br"></div>
      </div>
    </section>
  );
}

function PinnedSection({ id, image, imageAlt, headline, body, cta, ctaHref, textPosition, zIndex }: PinnedSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    if (!shouldUsePinnedScenes()) return;

    const section = sectionRef.current;
    const img = imageRef.current;
    const text = textRef.current;
    if (!section || !img || !text) return;

    const ctx = gsap.context(() => {
      const scrollTl = gsap.timeline({
        scrollTrigger: { trigger: section, start: 'top top', end: '+=130%', pin: true, scrub: 0.6 },
      });

      scrollTl
        .fromTo(img, { scale: 1.12, y: '8vh', opacity: 0.6 }, { scale: 1, y: 0, opacity: 1, ease: 'none' }, 0)
        .fromTo(text.querySelector('.section-headline'), { x: textPosition === 'left' ? '-40vw' : '40vw', opacity: 0 }, { x: 0, opacity: 1, ease: 'none' }, 0.05)
        .fromTo(text.querySelector('.section-body'), { y: '6vh', opacity: 0 }, { y: 0, opacity: 1, ease: 'none' }, 0.15)
        .fromTo(text.querySelector('.section-cta'), { y: '10vh', opacity: 0 }, { y: 0, opacity: 1, ease: 'none' }, 0.2)
        .fromTo(img, { scale: 1, opacity: 1 }, { scale: 1.06, opacity: 0, ease: 'power2.in' }, 0.7)
        .fromTo(text.querySelector('.section-headline'), { x: 0, opacity: 1 }, { x: textPosition === 'left' ? '-12vw' : '12vw', opacity: 0, ease: 'power2.in' }, 0.7)
        .fromTo(text.querySelector('.section-body'), { x: 0, opacity: 1 }, { x: textPosition === 'left' ? '-8vw' : '8vw', opacity: 0, ease: 'power2.in' }, 0.72)
        .fromTo(text.querySelector('.section-cta'), { opacity: 1 }, { opacity: 0, ease: 'power2.in' }, 0.78);
    }, section);

    return () => ctx.revert();
  }, [textPosition]);

  const textPositionClass = textPosition === 'left'
    ? 'left-[7vw] top-[18vh] w-[86vw] md:top-[22vh] md:w-[34vw]'
    : 'left-[7vw] top-[18vh] w-[86vw] md:left-auto md:right-[7vw] md:top-[24vh] md:w-[34vw]';

  const overlayClass = textPosition === 'left'
    ? 'bg-gradient-to-r from-paper/92 via-paper/75 to-transparent md:from-paper/80 md:via-paper/40'
    : 'bg-gradient-to-l from-paper/92 via-paper/75 to-transparent md:from-paper/80 md:via-paper/40';

  return (
    <section ref={sectionRef} id={id} className="section-pinned" style={{ zIndex }}>
      <div ref={imageRef} className="absolute inset-0">
        <img src={image} alt={imageAlt} width={1344} height={768} loading="lazy" decoding="async" className="h-full w-full object-cover" />
        <div className={`absolute inset-0 ${overlayClass}`}></div>
      </div>
      <div ref={textRef} className={`absolute z-20 ${textPositionClass}`}>
        <div className="relative">
          <div className="corner-mark corner-mark-tl"></div>
          <h2 className="section-headline text-balance mb-6 max-w-[14ch] font-serif text-section text-ink md:max-w-none">{headline}</h2>
          <p className="section-body mb-8 max-w-xl font-sans text-base leading-relaxed text-warm-gray md:max-w-none">{body}</p>
          <a href={ctaHref} className="section-cta cta-secondary inline-flex">{cta}<ArrowRight aria-hidden="true" className="ml-2 h-4 w-4" /></a>
        </div>
      </div>
    </section>
  );
}

function EvidenceSection() {
  return (
    <section className="relative bg-paper py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-[7vw]">
        <div className="mb-12 max-w-3xl md:mb-16">
          <p className="mb-4 text-eyebrow text-gold">How Walcott Works</p>
          <h2 className="mb-6 font-serif text-section text-ink">Strategy first. Infrastructure before launch.</h2>
          <p className="font-sans text-base leading-relaxed text-warm-gray">
            The point is not more assets. The point is a system that gives attention somewhere real to go before release day arrives.
          </p>
        </div>

        <div className="mb-16 grid gap-4 md:grid-cols-3">
          {PROOF_POINTS.map((point) => (
            <article key={point.title} className="border border-border bg-paper px-6 py-8 md:px-8">
              <p className="mb-4 text-eyebrow text-gold">{point.label}</p>
              <h3 className="mb-4 font-serif text-3xl text-ink">{point.title}</h3>
              <p className="font-sans text-sm leading-relaxed text-warm-gray">{point.body}</p>
            </article>
          ))}
        </div>

        <div className="mb-8 max-w-3xl">
          <p className="mb-4 text-eyebrow text-gold">Entry Paths</p>
          <h3 className="text-balance mb-4 font-serif text-3xl text-ink">Choose a Clear Next Step.</h3>
          <p className="font-sans text-base leading-relaxed text-warm-gray">
            Different books and publishing teams have different gaps. Start where the pressure is highest.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {ENTRY_PATHS.map((path) => (
            <a key={path.title} href={path.href} className="group border border-border bg-paper px-6 py-8 transition-colors hover:border-gold md:px-8">
              <p className="mb-4 font-serif text-3xl text-ink">{path.title}</p>
              <p className="mb-6 font-sans text-sm leading-relaxed text-warm-gray">{path.body}</p>
              <span className="inline-flex items-center gap-2 font-sans text-sm text-ink transition-colors group-hover:text-gold">
                {path.cta}
                <ArrowRight className="h-4 w-4" />
              </span>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}

function FrameworkSection() {
  return (
    <section id="framework" className="relative bg-secondary py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-[7vw]">
        <div className="grid gap-16 md:grid-cols-2 md:gap-12">
          <div>
            <p className="mb-4 text-eyebrow text-gold">The Pre-Launch Gap Framework</p>
            <h2 className="text-balance mb-6 font-serif text-section text-ink">See what is missing before launch week exposes it.</h2>
            <p className="mb-8 max-w-2xl font-sans text-base leading-relaxed text-warm-gray">
              The framework is the diagnostic we use to identify the structural gaps between the manuscript, the market, and the path to conversion. It gives the launch a plan before launch activity starts consuming time and budget.
            </p>

            <div className="grid gap-4 sm:grid-cols-2">
              {FRAMEWORK_PILLARS.map((pillar) => (
                <article key={pillar.title} className="border border-border bg-paper/50 p-6">
                  <h3 className="mb-3 font-serif text-3xl text-ink">{pillar.title}</h3>
                  <p className="font-sans text-sm leading-relaxed text-warm-gray">{pillar.body}</p>
                </article>
              ))}
            </div>

            <div className="mt-8 flex flex-col items-start gap-4 sm:flex-row sm:items-center">
              <a href="#contact" className="cta-primary">Request the Framework<ArrowRight aria-hidden="true" className="h-4 w-4" /></a>
              <a href={STRATEGY_CALL_HREF} className="cta-secondary">Talk through the launch</a>
            </div>
          </div>

          <div>
            <p className="mb-4 text-eyebrow text-gold">Common Questions</p>
            <div className="space-y-4">
              {FAQS.map((item) => (
                <article key={item.question} className="border border-border bg-paper/50 p-6">
                  <h3 className="mb-3 font-serif text-3xl text-ink">{item.question}</h3>
                  <p className="font-sans text-sm leading-relaxed text-warm-gray">{item.answer}</p>
                </article>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function ContactSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [submitNote, setSubmitNote] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const submitResetTimerRef = useRef<number | null>(null);

  useLayoutEffect(() => {
    if (prefersReducedMotion()) return;

    const section = sectionRef.current;
    const content = contentRef.current;
    if (!section || !content) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        content.querySelectorAll('.contact-animate'),
        { y: 40, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          stagger: 0.1,
          duration: 0.8,
          ease: 'power2.out',
          scrollTrigger: { trigger: section, start: 'top 80%', toggleActions: 'play none none reverse' },
        },
      );
    }, section);

    return () => ctx.revert();
  }, []);

  useEffect(() => {
    return () => {
      if (submitResetTimerRef.current !== null) {
        window.clearTimeout(submitResetTimerRef.current);
      }
    };
  }, []);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    const formData = new FormData(event.currentTarget);
    const name = String(formData.get('name') ?? '').trim();
    const subjectField = event.currentTarget.elements.namedItem('_subject');

    if (subjectField instanceof HTMLInputElement) {
      subjectField.value = `New Walcott inquiry from ${name || 'a prospective client'}`;
    }

    setIsSubmitting(true);
    setSubmitNote('A confirmation tab should open now. If nothing happens within a moment, email the studio directly.');

    if (submitResetTimerRef.current !== null) {
      window.clearTimeout(submitResetTimerRef.current);
    }

    submitResetTimerRef.current = window.setTimeout(() => {
      setIsSubmitting(false);
    }, 2500);
  };

  return (
    <section ref={sectionRef} id="contact" className="relative bg-ink py-24 text-paper md:py-32">
      <div ref={contentRef} className="mx-auto max-w-7xl px-[7vw]">
        <div className="grid gap-16 md:grid-cols-2 md:gap-24">
          <div>
            <h2 className="contact-animate text-balance mb-6 font-serif text-section text-paper">Request a Strategy Call.</h2>
            <p className="contact-animate mb-10 max-w-md font-sans text-base leading-relaxed text-paper/70">
              We work with authors, publishers, and expert-led projects that need stronger visibility before release. Use the form to request a strategy call or ask for the Pre-Launch Gap Framework.
            </p>
            <div className="mb-10 space-y-4">
              <div className="contact-animate flex items-center gap-3">
                <Mail aria-hidden="true" className="h-5 w-5 text-gold" />
                <a href={`mailto:${STUDIO_EMAIL}`} className="font-sans text-sm text-paper/90 transition-colors hover:text-gold">{STUDIO_EMAIL}</a>
              </div>
              <div className="contact-animate flex items-center gap-3">
                <MapPin aria-hidden="true" className="h-5 w-5 text-gold" />
                <span className="font-sans text-sm text-paper/90">Founder-led studio based in Medellin, Colombia</span>
              </div>
              <div className="contact-animate flex items-center gap-3">
                <Clock aria-hidden="true" className="h-5 w-5 text-gold" />
                <span className="font-sans text-sm text-paper/90">We typically reply within two business days.</span>
              </div>
            </div>
            <a href={FRAMEWORK_HREF} className="contact-animate inline-flex items-center gap-2 font-sans text-sm text-gold transition-colors hover:text-paper">
              <ArrowRight aria-hidden="true" className="h-4 w-4" />
              See the Pre-Launch Gap Framework
            </a>
          </div>

          <div className="contact-animate bg-paper/5 p-8 md:p-10">
            <form
              className="space-y-6"
              action={CONTACT_FORM_ENDPOINT}
              method="POST"
              acceptCharset="UTF-8"
              target="walcott-contact-submit"
              onSubmit={handleSubmit}
            >
              <input type="hidden" name="_subject" value="New Walcott strategy inquiry" />
              <input type="hidden" name="_template" value="table" />
              <input type="hidden" name="_captcha" value="false" />
              <input type="hidden" name="_honey" value="" />
              <input type="hidden" name="source_page" value="Walcott homepage contact form" />

              <div className="grid gap-6 md:grid-cols-2">
                <div>
                  <label htmlFor="contact-name" className="mb-2 block font-sans text-xs uppercase tracking-wider text-paper/60">Name</label>
                  <input id="contact-name" name="name" type="text" autoComplete="name" required className="w-full border-b border-paper/30 bg-transparent py-2 font-sans text-sm text-paper transition-colors focus:border-gold focus-visible:outline focus-visible:outline-2 focus-visible:outline-gold focus-visible:outline-offset-4" placeholder="Your name" />
                </div>
                <div>
                  <label htmlFor="contact-email" className="mb-2 block font-sans text-xs uppercase tracking-wider text-paper/60">Email</label>
                  <input id="contact-email" name="email" type="email" autoComplete="email" spellCheck={false} required className="w-full border-b border-paper/30 bg-transparent py-2 font-sans text-sm text-paper transition-colors focus:border-gold focus-visible:outline focus-visible:outline-2 focus-visible:outline-gold focus-visible:outline-offset-4" placeholder="name@example.com" />
                </div>
              </div>

              <div className="grid gap-6 md:grid-cols-2">
                <div>
                  <label htmlFor="contact-project-type" className="mb-2 block font-sans text-xs uppercase tracking-wider text-paper/60">Project type</label>
                  <select id="contact-project-type" name="project_type" required className="w-full border-b border-paper/30 bg-transparent py-2 font-sans text-sm text-paper transition-colors focus:border-gold focus-visible:outline focus-visible:outline-2 focus-visible:outline-gold focus-visible:outline-offset-4">
                    <option value="">Select the main need</option>
                    {PROJECT_TYPES.map((option) => <option key={option.value} value={option.value} className="text-ink">{option.label}</option>)}
                  </select>
                </div>
                <div>
                  <label htmlFor="contact-timeline" className="mb-2 block font-sans text-xs uppercase tracking-wider text-paper/60">Timeline</label>
                  <select id="contact-timeline" name="launch_timeline" required className="w-full border-b border-paper/30 bg-transparent py-2 font-sans text-sm text-paper transition-colors focus:border-gold focus-visible:outline focus-visible:outline-2 focus-visible:outline-gold focus-visible:outline-offset-4">
                    <option value="">Select the launch timing</option>
                    {TIMELINES.map((option) => <option key={option.value} value={option.value} className="text-ink">{option.label}</option>)}
                  </select>
                </div>
              </div>

              <div>
                <label htmlFor="contact-message" className="mb-2 block font-sans text-xs uppercase tracking-wider text-paper/60">Message</label>
                <textarea id="contact-message" name="message" rows={4} required className="w-full resize-none border-b border-paper/30 bg-transparent py-2 font-sans text-sm text-paper transition-colors focus:border-gold focus-visible:outline focus-visible:outline-2 focus-visible:outline-gold focus-visible:outline-offset-4" placeholder="Tell us about the book, launch window, and what is missing between the manuscript and market visibility."></textarea>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-gold py-4 font-sans text-sm font-medium text-ink transition-colors duration-300 hover:bg-paper disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isSubmitting ? 'Opening confirmation...' : 'Send Strategy Request'}
              </button>
              <p className="font-sans text-xs leading-relaxed text-paper/50">
                Submitting opens a confirmation tab and sends the brief to Walcott. We only use this information to reply about your request. Prefer direct email? Write to <a href={`mailto:${STUDIO_EMAIL}`} className="text-paper/80 transition-colors hover:text-gold">{STUDIO_EMAIL}</a>.
              </p>
              {submitNote ? <p aria-live="polite" className="font-sans text-xs text-gold">{submitNote}</p> : null}
            </form>
          </div>
        </div>

        <footer className="mt-24 border-t border-paper/10 pt-12">
          <div className="grid gap-10 md:grid-cols-4">
            <div>
              <h4 className="mb-4 font-serif text-lg text-paper">Walcott & Co. Press</h4>
              <p className="font-sans text-sm leading-relaxed text-paper/60">We build pre-launch visibility systems, author websites, and launch infrastructure for books that should reach the market with force.</p>
            </div>
            <div>
              <h5 className="mb-4 font-sans text-xs uppercase tracking-wider text-paper/40">Navigation</h5>
              <ul className="space-y-2">
                <li><a href="#problem" className="font-sans text-sm text-paper/70 transition-colors hover:text-gold">Problem</a></li>
                <li><a href="#services" className="font-sans text-sm text-paper/70 transition-colors hover:text-gold">Services</a></li>
                <li><a href="#process" className="font-sans text-sm text-paper/70 transition-colors hover:text-gold">Process</a></li>
                <li><a href="#framework" className="font-sans text-sm text-paper/70 transition-colors hover:text-gold">Framework</a></li>
                <li><a href="#contact" className="font-sans text-sm text-paper/70 transition-colors hover:text-gold">Contact</a></li>
              </ul>
            </div>
            <div>
              <h5 className="mb-4 font-sans text-xs uppercase tracking-wider text-paper/40">Services</h5>
              <ul className="space-y-2">
                <li><a href="#services" className="font-sans text-sm text-paper/70 transition-colors hover:text-gold">Pre-Launch Visibility Systems</a></li>
                <li><a href="#process" className="font-sans text-sm text-paper/70 transition-colors hover:text-gold">Author and Title Websites</a></li>
                <li><a href="#process" className="font-sans text-sm text-paper/70 transition-colors hover:text-gold">Launch Content Production</a></li>
                <li><a href="#contact" className="font-sans text-sm text-paper/70 transition-colors hover:text-gold">Publisher Support</a></li>
              </ul>
            </div>
            <div>
              <h5 className="mb-4 font-sans text-xs uppercase tracking-wider text-paper/40">Contact</h5>
              <ul className="space-y-2">
                <li><a href={`mailto:${STUDIO_EMAIL}`} className="font-sans text-sm text-paper/70 transition-colors hover:text-gold">Email the studio</a></li>
                <li><a href={FRAMEWORK_HREF} className="font-sans text-sm text-paper/70 transition-colors hover:text-gold">See the Gap Framework</a></li>
                <li><a href={STRATEGY_CALL_HREF} className="font-sans text-sm text-paper/70 transition-colors hover:text-gold">Request a Strategy Call</a></li>
              </ul>
            </div>
          </div>
          <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-paper/10 pt-6 md:flex-row">
            <p className="font-sans text-xs text-paper/40">Copyright {new Date().getFullYear()} Walcott & Co. Press. All rights reserved. Medellin, Colombia.</p>
            <div className="flex items-center gap-6">
              <a href="#home" className="font-sans text-xs text-paper/40 transition-colors hover:text-paper/70">Back to top</a>
              <a href={`mailto:${STUDIO_EMAIL}`} className="font-sans text-xs text-paper/40 transition-colors hover:text-paper/70">{STUDIO_EMAIL}</a>
            </div>
          </div>
        </footer>
      </div>
    </section>
  );
}

function App() {
  useEffect(() => {
    if (!shouldUsePinnedScenes()) return;

    const setupSnap = () => {
      const pinned = ScrollTrigger.getAll().filter((trigger) => trigger.vars.pin).sort((a, b) => a.start - b.start);
      const maxScroll = ScrollTrigger.maxScroll(window);
      if (!maxScroll || pinned.length === 0) return;

      const pinnedRanges = pinned.map((trigger) => ({
        start: trigger.start / maxScroll,
        end: (trigger.end ?? trigger.start) / maxScroll,
        center: (trigger.start + ((trigger.end ?? trigger.start) - trigger.start) * 0.5) / maxScroll,
      }));

      ScrollTrigger.create({
        snap: {
          snapTo: (value: number) => {
            const inPinnedRange = pinnedRanges.some((range) => value >= range.start - 0.02 && value <= range.end + 0.02);
            if (!inPinnedRange) return value;
            return pinnedRanges.reduce((closest, range) => (
              Math.abs(range.center - value) < Math.abs(closest - value) ? range.center : closest
            ), pinnedRanges[0]?.center ?? 0);
          },
          duration: { min: 0.15, max: 0.35 },
          delay: 0,
          ease: 'power2.out',
        },
      });
    };

    const timer = setTimeout(setupSnap, 100);
    return () => {
      clearTimeout(timer);
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, []);

  return (
    <div className="relative bg-paper">
      <div className="ink-wash-overlay"></div>
      <a href="#main-content" className="sr-only absolute left-4 top-4 z-[1001] rounded-sm bg-ink px-4 py-2 font-sans text-sm text-paper focus:not-sr-only focus:outline focus:outline-2 focus:outline-gold focus:outline-offset-4">
        Skip to Main Content
      </a>
      <Navigation />
      <main id="main-content" className="relative">
        <HeroSection />
        {PINNED_SECTIONS.map((section) => <PinnedSection key={section.headline} {...section} />)}
        <EvidenceSection />
        <FrameworkSection />
        <ContactSection />
      </main>
    </div>
  );
}

export default App;
