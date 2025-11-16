// src/components/LpCard/LpCardSkeleton.tsx
const LpCardSkeleton = () => {
  return (
    <div className="rounded-xl overflow-hidden shadow-lg animate-pulse bg-gradient-to-b from-gray-800 to-gray-900 border border-gray-700/50">
      {/* 이미지 스켈레톤 */}
      <div className="bg-gray-700 w-full h-48" />
      
      {/* 정보 스켈레톤 */}
      <div className="p-4 space-y-3">
        <div className="bg-gray-700 h-5 w-3/4 rounded" />
        <div className="flex gap-2">
          <div className="bg-gray-700 h-6 w-16 rounded-full" />
          <div className="bg-gray-700 h-6 w-20 rounded-full" />
        </div>
      </div>
    </div>
  );
};

export default LpCardSkeleton;