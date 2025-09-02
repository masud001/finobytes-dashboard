interface SectionHeaderProps {
  title: string;
  description: string;
}

const SectionHeader: React.FC<SectionHeaderProps> = ({ title, description }) => {
  return (
    <div className="text-center">
      <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
        {title}
      </h2>
      <p className="mt-4 max-w-2xl mx-auto text-xl text-gray-500">
        {description}
      </p>
    </div>
  );
};

export default SectionHeader;
