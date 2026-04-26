import { useState, type FormEvent } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { MapPin, Phone, CheckCircle } from 'lucide-react';
import CTAButtonGroup from '@/components/CTAButtonGroup';
import { PHONE_NUMBER, PHONE_NUMBER_2, PHONE_LINK, PHONE_LINK_2, EMAIL } from '@/lib/constants';
import { asset } from '@/lib/asset';

const cities = [
  'Lawrenceville', 'Suwanee', 'Buford', 'Dacula', 'Lilburn', 'Snellville',
  'Grayson', 'Loganville', 'Duluth', 'Norcross', 'Peachtree Corners', 'Sugar Hill',
  'Auburn', 'Winder',
];

const hours = [
  { day: 'Monday', dayEs: 'Lunes', time: '8:00 AM – 6:00 PM' },
  { day: 'Tuesday', dayEs: 'Martes', time: '8:00 AM – 6:00 PM' },
  { day: 'Wednesday', dayEs: 'Miércoles', time: '8:00 AM – 6:00 PM' },
  { day: 'Thursday', dayEs: 'Jueves', time: '8:00 AM – 6:00 PM' },
  { day: 'Friday', dayEs: 'Viernes', time: '8:00 AM – 6:00 PM' },
  { day: 'Saturday', dayEs: 'Sábado', time: '9:00 AM – 4:00 PM' },
  { day: 'Sunday', dayEs: 'Domingo', time: 'closed', closed: true },
];

const serviceOptions = [
  { value: '', labelKey: 'contact.servicePlaceholder' },
  { value: 'exterior', labelKey: 'contact.serviceExterior' },
  { value: 'interior', labelKey: 'contact.serviceInterior' },
  { value: 'full', labelKey: 'contact.serviceFull' },
  { value: 'deepInterior', labelKey: 'contact.serviceDeepInterior' },
  { value: 'driveway', labelKey: 'contact.serviceDriveway' },
  { value: 'walkway', labelKey: 'contact.serviceWalkway' },
  { value: 'house', labelKey: 'contact.serviceHouse' },
  { value: 'deck', labelKey: 'contact.serviceDeck' },
  { value: 'bundle', labelKey: 'contact.serviceBundle' },
  { value: 'other', labelKey: 'contact.serviceOther' },
];

export default function ContactPage() {
  const { t, i18n } = useTranslation();
  const [formState, setFormState] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [formData, setFormData] = useState({ name: '', phone: '', service: '', message: '' });
  const [errors, setErrors] = useState<Record<string, boolean>>({});

  const isSpanish = i18n.language === 'es';

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, boolean> = {};
    if (!formData.name.trim()) newErrors.name = true;
    if (!formData.phone.trim()) newErrors.phone = true;
    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) return;

    setFormState('submitting');
    // Replace FORMSPREE_FORM_ID with your ID from formspree.io/forms
    fetch('https://formspree.io/f/FORMSPREE_FORM_ID', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({
        name: formData.name,
        phone: formData.phone,
        service: formData.service,
        message: formData.message,
      }),
    })
      .then((res) => {
        if (res.ok) {
          setFormState('success');
        } else {
          setFormState('error');
        }
      })
      .catch(() => setFormState('error'));
  };

  return (
    <>
      {/* Page Hero */}
      <section className="bg-brand-blue pt-24 pb-12 md:pt-28 md:pb-16">
        <div className="max-w-[700px] mx-auto px-4 text-center">
          <span className="hero-badge inline-block text-brand-yellow font-heading font-bold text-[11px] uppercase tracking-wider mb-3">
            {t('contact.pageLabel')}
          </span>
          <h1 className="hero-heading text-[28px] md:text-4xl font-heading font-bold text-white">
            {t('contact.heading')}
          </h1>
          <a
            href={PHONE_LINK}
            className="hero-subheading block text-brand-yellow font-heading font-bold text-3xl md:text-4xl mt-4 hover:brightness-110 transition-all"
          >
            {PHONE_NUMBER}
          </a>
          <a
            href={PHONE_LINK_2}
            className="block text-white font-heading font-bold text-xl md:text-2xl mt-1 hover:text-brand-yellow transition-all"
          >
            {PHONE_NUMBER_2}
          </a>
          <a
            href={`mailto:${EMAIL}`}
            className="block text-white/70 font-body text-sm mt-2 hover:text-brand-yellow transition-all"
          >
            {EMAIL}
          </a>
          <p className="text-white/70 font-body text-sm mt-2">
            {t('cta.callOrTextAnytime')}
          </p>
          <div className="hero-cta mt-6 flex justify-center">
            <CTAButtonGroup />
          </div>
        </div>
      </section>

      {/* Service Area Map + Cities */}
      <section className="bg-[#F5F5F5] py-12 md:py-16">
        <div className="max-w-[1200px] mx-auto px-4 md:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
            <div className="reveal">
              <img
                src={asset('/assets/service-area-map.jpg')}
                alt="Service area map"
                className="w-full rounded-xl shadow-[0_2px_8px_rgba(0,0,0,0.08)]"
              />
            </div>
            <div>
              <h3 className="reveal font-heading font-bold text-xl text-brand-blue mb-4">
                {t('contact.citiesHeading')}
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {cities.map((city, i) => (
                  <div key={city} className={`reveal reveal-delay-${Math.min(i % 6, 5)} flex items-center gap-2`}>
                    <MapPin size={12} className="text-brand-yellow flex-shrink-0" />
                    <span className="text-[#1A1A1A] font-body text-[15px]">{city}</span>
                  </div>
                ))}
              </div>
              <p className="reveal text-[#6B7280] font-body text-sm italic mt-5">
                {t('contact.cityNote')}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Business Hours */}
      <section className="bg-white py-8 md:py-12">
        <div className="max-w-[500px] mx-auto px-4">
          <div className="text-center mb-6">
            <span className="reveal inline-block px-3 py-1 rounded-full text-[11px] font-heading font-bold uppercase tracking-wider bg-brand-yellow text-brand-blue mb-3">
              {t('contact.hoursLabel')}
            </span>
          </div>
          <div className="reveal">
            {hours.map((h, i) => (
              <div key={h.day} className={`reveal reveal-delay-${Math.min(i, 6)} flex justify-between py-2.5 border-b border-gray-100`}>
                <span className="text-[#1A1A1A] font-body text-[15px]">
                  {isSpanish ? h.dayEs : h.day}
                </span>
                <span className={`font-body text-[15px] ${h.closed ? 'text-[#6B7280]' : 'text-[#1A1A1A] font-medium'}`}>
                  {h.closed ? t('contact.closed') : h.time}
                </span>
              </div>
            ))}
          </div>
          <p className="reveal text-[#6B7280] font-body text-[13px] text-center mt-4">
            {t('contact.responseNote')}
          </p>
        </div>
      </section>

      {/* Contact Form */}
      <section className="bg-light-blue py-12 md:py-16">
        <div className="max-w-[600px] mx-auto px-4">
          <div className="text-center mb-6">
            <span className="reveal inline-block px-3 py-1 rounded-full text-[11px] font-heading font-bold uppercase tracking-wider bg-brand-yellow text-brand-blue mb-3">
              {t('contact.formLabel')}
            </span>
            <h2 className="reveal text-2xl md:text-3xl font-heading font-bold text-[#1A1A1A] mb-2">
              {t('contact.formHeading')}
            </h2>
            <p className="reveal text-[#6B7280] font-body text-[15px]">
              {t('contact.formDesc')}
            </p>
          </div>

          {formState === 'success' ? (
            <div className="reveal bg-white rounded-xl p-8 text-center shadow-[0_2px_8px_rgba(0,0,0,0.08)]">
              <CheckCircle size={48} className="text-success mx-auto mb-4" />
              <h3 className="font-heading font-bold text-xl text-[#1A1A1A] mb-2">
                {t('contact.success')}
              </h3>
              <Link to="/gallery" className="text-brand-blue font-heading font-semibold hover:underline">
                {t('contact.successLink')}
              </Link>
            </div>
          ) : formState === 'error' ? (
            <div className="reveal bg-white rounded-xl p-8 text-center shadow-[0_2px_8px_rgba(0,0,0,0.08)]">
              <p className="text-red-500 font-body mb-2">{t('contact.error')}</p>
              <a href={PHONE_LINK} className="text-brand-blue font-heading font-semibold hover:underline">
                {PHONE_NUMBER}
              </a>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="reveal">
                <label className="block font-heading font-semibold text-[13px] text-brand-blue mb-1">
                  {t('contact.nameLabel')} *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder={t('contact.namePlaceholder')}
                  className={`w-full px-4 py-3 rounded-lg border font-body text-base text-[#1A1A1A] bg-white focus:outline-none focus:border-brand-blue focus:ring-[3px] focus:ring-brand-blue/15 transition-all ${
                    errors.name ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.name && <p className="text-red-500 text-xs mt-1">{t('contact.fieldRequired')}</p>}
              </div>
              <div className="reveal reveal-delay-1">
                <label className="block font-heading font-semibold text-[13px] text-brand-blue mb-1">
                  {t('contact.phoneLabel')} *
                </label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder={t('contact.phonePlaceholder')}
                  className={`w-full px-4 py-3 rounded-lg border font-body text-base text-[#1A1A1A] bg-white focus:outline-none focus:border-brand-blue focus:ring-[3px] focus:ring-brand-blue/15 transition-all ${
                    errors.phone ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.phone && <p className="text-red-500 text-xs mt-1">{t('contact.fieldRequired')}</p>}
              </div>
              <div className="reveal reveal-delay-2">
                <label className="block font-heading font-semibold text-[13px] text-brand-blue mb-1">
                  {t('contact.serviceLabel')}
                </label>
                <select
                  value={formData.service}
                  onChange={(e) => setFormData({ ...formData, service: e.target.value })}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 font-body text-base text-[#1A1A1A] bg-white focus:outline-none focus:border-brand-blue focus:ring-[3px] focus:ring-brand-blue/15 transition-all"
                >
                  {serviceOptions.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {t(opt.labelKey)}
                    </option>
                  ))}
                </select>
              </div>
              <div className="reveal reveal-delay-3">
                <label className="block font-heading font-semibold text-[13px] text-brand-blue mb-1">
                  {t('contact.messageLabel')}
                </label>
                <textarea
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder={t('contact.messagePlaceholder')}
                  rows={4}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 font-body text-base text-[#1A1A1A] bg-white focus:outline-none focus:border-brand-blue focus:ring-[3px] focus:ring-brand-blue/15 transition-all resize-none"
                />
              </div>
              <div className="reveal reveal-delay-4">
                <button
                  type="submit"
                  disabled={formState === 'submitting'}
                  className="w-full md:w-auto md:mx-auto md:block bg-brand-blue text-white font-heading font-bold text-base px-8 py-3.5 rounded-lg shadow-[0_2px_4px_rgba(0,0,0,0.15)] hover:bg-dark-blue disabled:opacity-60 transition-all"
                >
                  {formState === 'submitting' ? '...' : t('contact.submit')}
                </button>
                <p className="text-[#6B7280] font-body text-xs text-center mt-2">
                  {t('contact.required')}
                </p>
                <p className="text-brand-blue font-body text-[13px] font-medium text-center mt-1 flex items-center justify-center gap-1">
                  <Phone size={14} />
                  {t('contact.fasterResponse')}
                </p>
              </div>
            </form>
          )}
        </div>
      </section>
    </>
  );
}
