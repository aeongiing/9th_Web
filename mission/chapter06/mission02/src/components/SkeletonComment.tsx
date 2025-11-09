// src/components/SkeletonComment.tsx
export default function SkeletonComment() {
  return (
    <div className="border-b border-neutral-700 pb-4 animate-pulse">
      <div className="flex items-center gap-2 mb-2">
        <div className="h-4 bg-neutral-700 rounded w-24" />
        <div className="h-3 bg-neutral-700 rounded w-32" />
      </div>
      <div className="h-4 bg-neutral-700 rounded w-full mb-2" />
      <div className="h-4 bg-neutral-700 rounded w-3/4" />
    </div>
  );
}