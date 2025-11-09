import { useParams, useNavigate } from 'react-router-dom';
import { useLpDetail, useLikeLp, useUnlikeLp } from '../hooks/queries/useLpQueries';
import { useState } from 'react';

export default function LpDetailPage() {
  const { lpId } = useParams<{ lpId: string }>();
  const navigate = useNavigate();
  const [isLiked, setIsLiked] = useState(false);

  const { data: lp, isLoading, isError, error } = useLpDetail(Number(lpId));
  const likeMutation = useLikeLp();
  const unlikeMutation = useUnlikeLp();

  const handleLike = async () => {
    if (!lpId) return;
    
    try {
      if (isLiked) {
        await unlikeMutation.mutateAsync(Number(lpId));
      } else {
        await likeMutation.mutateAsync(Number(lpId));
      }
      // API 호출 성공 후에만 상태 업데이트
      setIsLiked(!isLiked);
    } catch (error) {
      console.error('좋아요 처리 실패:', error);
      // 에러 발생 시 사용자에게 알림 (선택사항)
      alert('좋아요 처리에 실패했습니다. 다시 시도해주세요.');
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto p-6 space-y-4 animate-pulse">
        <div className="h-8 bg-neutral-700 rounded w-1/4" />
        <div className="h-12 bg-neutral-700 rounded w-3/4" />
        <div className="h-4 bg-neutral-700 rounded w-full" />
        <div className="h-96 bg-neutral-700 rounded" />
        <div className="h-32 bg-neutral-700 rounded" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-4">
        <p>에러: {error.message}</p>
        <button onClick={() => navigate('/lps')} className="px-4 py-2 bg-fuchsia-600 rounded">
          목록으로
        </button>
      </div>
    );
  }

  if (!lp) return <div>LP를 찾을 수 없습니다.</div>;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <button onClick={() => navigate('/lps')} className="mb-4 px-4 py-2 bg-neutral-700 rounded hover:bg-neutral-600">
        ← 목록으로
      </button>

      <h1 className="text-4xl font-bold mb-4">{lp.title}</h1>

      <div className="flex gap-4 text-sm text-neutral-400 mb-6">
        <span>작성자: {lp.author.nickname}</span>
        <span>업로드일: {new Date(lp.uploadedAt).toLocaleDateString()}</span>
        <span>조회수: {lp.viewCount}</span>
        <span>좋아요: {lp.likeCount}</span>
      </div>

      <img src={lp.thumbnailUrl} alt={lp.title} className="w-full max-h-[500px] object-cover rounded-lg mb-6" />

      <div className="prose prose-invert max-w-none mb-6">
        <p>{lp.content}</p>
      </div>

      <div className="flex gap-4 justify-end">
        <button
          onClick={handleLike}
          disabled={likeMutation.isPending || unlikeMutation.isPending}
          className={`px-6 py-3 rounded transition disabled:opacity-50 disabled:cursor-not-allowed ${
            isLiked ? 'bg-red-600 hover:bg-red-500' : 'bg-fuchsia-600 hover:bg-fuchsia-500'
          }`}
        >
          {likeMutation.isPending || unlikeMutation.isPending ? '처리중...' : isLiked ? '❤️ 좋아요 취소' : '🤍 좋아요'}
        </button>
        <button className="px-6 py-3 bg-green-600 hover:bg-green-500 rounded transition">
          수정
        </button>
        <button className="px-6 py-3 bg-red-600 hover:bg-red-500 rounded transition">
          삭제
        </button>
      </div>
    </div>
  );
}
