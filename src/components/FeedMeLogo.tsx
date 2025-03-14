
interface LogoProps {
  className?: string;
}

const FeedMeLogo = ({ className = "w-40" }: LogoProps) => {
  return (
    <div className={`flex items-center ${className}`}>
      <div className="text-white font-bold text-xl flex items-center">
        <span className="text-feedme-500">Feed</span>
        <span className="text-white">Me</span>
        <span className="ml-1 bg-feedme-500 w-2 h-2 rounded-full"></span>
      </div>
    </div>
  );
};

export default FeedMeLogo;
