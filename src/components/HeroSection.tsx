interface HeroSectionProps {
  title: string;
  titleHighlight: string;
  description: string;
}

const HeroSection: React.FC<HeroSectionProps> = ({
  title,
  titleHighlight,
  description
}) => {
  return (
    <div className="text-center">
      <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
        <span className="block">{title}</span>
        <span className="block text-blue-600">{titleHighlight}</span>
      </h1>
      <p className="mt-3 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
        {description}
      </p>
    </div>
  );
};

export default HeroSection;
