export default function SkeletonCard() {
  return (
    <div className="rounded-lg overflow-hidden bg-neutral-800 animate-pulse">
      <div className="w-full h-[300px] bg-neutral-700" />
      <div className="p-4 space-y-2">
        <div className="h-4 bg-neutral-700 rounded w-3/4" />
        <div className="h-3 bg-neutral-700 rounded w-1/2" />
      </div>
    </div>
  );
}