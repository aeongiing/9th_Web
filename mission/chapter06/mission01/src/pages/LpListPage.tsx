import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLpList } from '../hooks/queries/useLpQueries';
import SkeletonCard from '../components/SkeletonCard';

export default function LpListPage() {
  const navigate = useNavigate();
  const [sort, setSort] = useState<'latest' | 'oldest'>('latest');

  const { data, isLoading, isError, error, refetch, isFetching } = useLpList({ sort });

  const handleSortToggle = () => {
    setSort((prev) => (prev === 'latest' ? 'oldest' : 'latest'));
  };

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">LP 목록</h1>
          <button disabled className="px-4 py-2 bg-neutral-700 rounded">
            로딩 중...
          </button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, idx) => (
            <SkeletonCard key={idx} />
          ))}
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-4">
        <p>에러가 발생했어요: {error.message}</p>
        <button onClick={() => refetch()} className="px-4 py-2 bg-fuchsia-600 rounded">
          다시 시도
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">LP 목록</h1>
        <button
          onClick={handleSortToggle}
          disabled={isFetching}
          className="px-4 py-2 bg-fuchsia-600 hover:bg-fuchsia-500 rounded transition disabled:bg-neutral-700"
        >
          {isFetching ? '정렬 중...' : sort === 'latest' ? '최신순' : '오래된순'}
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {data?.lps.map((lp) => (
          <div
            key={lp.id}
            onClick={() => navigate(`/lp/${lp.id}`)}
            className="group relative rounded-lg overflow-hidden cursor-pointer transform transition hover:scale-105"
          >
            <img src={lp.thumbnailUrl} alt={lp.title} className="w-full h-[300px] object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 to-transparent opacity-0 group-hover:opacity-100 transition flex flex-col justify-end p-4">
              <h3 className="text-white font-bold mb-2">{lp.title}</h3>
              <div className="flex gap-4 text-sm text-neutral-300">
                <span>👁 {lp.viewCount}</span>
                <span>❤️ {lp.likeCount}</span>
              </div>
              <p className="text-xs text-neutral-400 mt-1">
                {new Date(lp.uploadedAt).toLocaleDateString()}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* 플로팅 버튼 */}
      <button
        onClick={() => navigate('/lp/create')}
        className="fixed bottom-8 right-8 w-16 h-16 bg-fuchsia-600 hover:bg-fuchsia-500 rounded-full text-3xl shadow-lg transition hover:scale-110"
      >
        +
      </button>
    </div>
  );
}