interface SectionHeaderProps {
  label: string;
  heading: string;
  subheading?: string;
  light?: boolean;
}

export default function SectionHeader({ label, heading, subheading, light = false }: SectionHeaderProps) {
  return (
    <div className="text-center mb-8 md:mb-10">
      <span className={`inline-block px-3 py-1 rounded-full text-[11px] font-heading font-bold uppercase tracking-wider mb-3 ${
        light ? 'bg-white text-brand-blue' : 'bg-brand-yellow text-brand-blue'
      }`}>
        {label}
      </span>
      <h2 className={`text-2xl md:text-3xl lg:text-4xl font-heading font-bold mb-3 ${
        light ? 'text-white' : 'text-[#1A1A1A]'
      }`}>
        {heading}
      </h2>
      {subheading && (
        <p className={`text-base max-w-[600px] mx-auto ${
          light ? 'text-white/80' : 'text-[#6B7280]'
        }`}>
          {subheading}
        </p>
      )}
    </div>
  );
}
