// src/components/LpCard/LpCard.tsx
import { useNavigate } from "react-router-dom";
import { type Lp } from "../../types/lp";
import { Play } from "lucide-react";

interface LpCardProps {
  lp: Lp;
}

const LpCard = ({ lp }: LpCardProps) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/lp/${lp.id}`);
  };

  return (
    <div
      onClick={handleClick}
      className="group relative rounded-xl overflow-hidden shadow-lg hover:shadow-2xl hover:shadow-blue-500/20 transition-all duration-300 cursor-pointer bg-gradient-to-b from-gray-800 to-gray-900 border border-gray-700/50 hover:border-blue-500/50 transform hover:-translate-y-2"
    >
      {/* 이미지 */}
      <div className="relative h-48 overflow-hidden">
        <img
          src={lp.thumbnail}
          alt={lp.title}
          className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-300"
        />
        {/* 오버레이 */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
          <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
            <Play size={24} className="text-white" fill="white" />
          </div>
        </div>
      </div>

      {/* 정보 */}
      <div className="p-4">
        <h3 className="text-white text-base font-semibold line-clamp-2 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-blue-400 group-hover:to-purple-400 group-hover:bg-clip-text transition-all">
          {lp.title}
        </h3>
        
        {/* 태그 */}
        {lp.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-2">
            {lp.tags.slice(0, 2).map((tag) => (
              <span
                key={tag.id}
                className="text-xs px-2 py-1 bg-gradient-to-r from-blue-600/20 to-purple-600/20 border border-blue-500/30 text-blue-300 rounded-full"
              >
                #{tag.name}
              </span>
            ))}
            {lp.tags.length > 2 && (
              <span className="text-xs px-2 py-1 bg-gray-700/50 text-gray-400 rounded-full">
                +{lp.tags.length - 2}
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default LpCard;