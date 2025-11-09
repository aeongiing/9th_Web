// src/pages/LpDetailPage.tsx
import { useParams, useNavigate } from 'react-router-dom';
import { useLpDetail, useLikeLp, useUnlikeLp, useComments } from '../hooks/queries/useLpQueries';
import { useState, useEffect, useRef } from 'react';
import SkeletonComment from '../components/SkeletonComment';

export default function LpDetailPage() {
  const { lpId } = useParams<{ lpId: string }>();
  const navigate = useNavigate();
  const [isLiked, setIsLiked] = useState(false);
  const [commentOrder, setCommentOrder] = useState<'latest' | 'oldest'>('latest');
  const [commentText, setCommentText] = useState('');
  const observerRef = useRef<HTMLDivElement>(null);

  const { data: lp, isLoading, isError, error } = useLpDetail(Number(lpId));
  const likeMutation = useLikeLp();
  const unlikeMutation = useUnlikeLp();
  
  const {
    data: commentsData,
    isLoading: isCommentsLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useComments({ lpId: Number(lpId), order: commentOrder });

  // 댓글 무한 스크롤
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      { threshold: 0.1 }
    );

    if (observerRef.current) {
      observer.observe(observerRef.current);
    }

    return () => observer.disconnect();
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

  const handleLike = async () => {
    if (!lpId) return;
    
    try {
      if (isLiked) {
        await unlikeMutation.mutateAsync(Number(lpId));
      } else {
        await likeMutation.mutateAsync(Number(lpId));
      }
      setIsLiked(!isLiked);
    } catch (error) {
      console.error('좋아요 처리 실패:', error);
      alert('좋아요 처리에 실패했습니다. 다시 시도해주세요.');
    }
  };

  const handleCommentSubmit = () => {
    if (commentText.trim().length < 1) {
      alert('댓글 내용을 입력해주세요.');
      return;
    }
    if (commentText.trim().length > 500) {
      alert('댓글은 500자 이내로 입력해주세요.');
      return;
    }
    // TODO: 댓글 작성 API 연동
    console.log('댓글 작성:', commentText);
    setCommentText('');
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

  const allComments = commentsData?.pages.flatMap(page => page.comments) ?? [];

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

      <div className="flex gap-4 justify-end mb-12">
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

      {/* 댓글 섹션 */}
      <div className="border-t border-neutral-700 pt-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">
            댓글 {commentsData?.pages[0]?.totalCount || 0}개
          </h2>
          <button
            onClick={() => setCommentOrder(prev => prev === 'latest' ? 'oldest' : 'latest')}
            className="px-4 py-2 bg-neutral-700 hover:bg-neutral-600 rounded transition text-sm"
          >
            {commentOrder === 'latest' ? '최신순' : '오래된순'}
          </button>
        </div>

        {/* 댓글 작성란 */}
        <div className="mb-8 p-4 bg-neutral-900 rounded-lg">
          <textarea
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            placeholder="댓글을 입력하세요..."
            className="w-full bg-neutral-800 text-white p-3 rounded resize-none focus:outline-none focus:ring-2 focus:ring-fuchsia-600"
            rows={3}
            maxLength={500}
          />
          <div className="flex justify-between items-center mt-2">
            <span className={`text-sm ${commentText.length > 500 ? 'text-red-500' : 'text-neutral-400'}`}>
              {commentText.length}/500
            </span>
            <button
              onClick={handleCommentSubmit}
              disabled={commentText.trim().length < 1 || commentText.length > 500}
              className="px-6 py-2 bg-fuchsia-600 hover:bg-fuchsia-500 rounded transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              댓글 작성
            </button>
          </div>
        </div>

        {/* 댓글 목록 */}
        <div className="space-y-4">
          {isCommentsLoading ? (
            Array.from({ length: 5 }).map((_, idx) => (
              <SkeletonComment key={idx} />
            ))
          ) : allComments.length === 0 ? (
            <p className="text-center text-neutral-400 py-8">첫 댓글을 작성해보세요!</p>
          ) : (
            allComments.map((comment) => (
              <div key={comment.id} className="border-b border-neutral-700 pb-4">
                <div className="flex items-center gap-2 mb-2">
                  <span className="font-semibold">{comment.author.nickname}</span>
                  <span className="text-sm text-neutral-400">
                    {new Date(comment.createdAt).toLocaleString()}
                  </span>
                </div>
                <p className="text-neutral-200">{comment.content}</p>
              </div>
            ))
          )}

          {/* 무한 스크롤 트리거 */}
          <div ref={observerRef} className="py-4">
            {isFetchingNextPage && (
              <div className="space-y-4">
                {Array.from({ length: 3 }).map((_, idx) => (
                  <SkeletonComment key={`loading-${idx}`} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}