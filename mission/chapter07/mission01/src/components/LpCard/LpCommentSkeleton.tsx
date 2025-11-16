// src/components/LpCard/LpCommentSkeleton.tsx
const LpCommentSkeleton = () => {
  return (
    <div className="bg-gray-900/50 border border-gray-700/50 rounded-xl p-5 animate-pulse">
      <div className="space-y-3">
        <div className="flex items-center gap-3">
          <div className="bg-gray-700 h-10 w-10 rounded-full" />
          <div className="flex-1">
            <div className="bg-gray-700 h-4 w-24 rounded mb-2" />
            <div className="bg-gray-700 h-3 w-32 rounded" />
          </div>
        </div>
        <div className="space-y-2">
          <div className="bg-gray-700 h-4 w-full rounded" />
          <div className="bg-gray-700 h-4 w-5/6 rounded" />
        </div>
      </div>
    </div>
  );
};

export default LpCommentSkeleton; 