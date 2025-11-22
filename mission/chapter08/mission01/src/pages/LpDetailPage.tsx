// src/pages/LpDetailPage.tsx
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getLpById } from "../apis/lp";
import { type Lp } from "../types/lp.ts";
import { useInView } from "react-intersection-observer";
import { PAGINATION_ORDER } from "../enums/common";
import { useInfiniteComments } from "../hooks/queries/useGetInfiniteComment";
import LpCommentSkeleton from "../components/LpCard/LpCommentSkeleton";
import { Heart, MoreVertical, Pencil, Trash2, Send, Calendar, Tag as TagIcon } from "lucide-react";
import usePostLike from "../hooks/mutation/usePostLike";
import useDeleteLike from "../hooks/mutation/useDeleteLike";
import useGetMyInfo from "../hooks/queries/useGetMyInfo";
import usePostComment from "../hooks/mutation/usePostComment";
import useUpdateComment from "../hooks/mutation/useUpdateComment";
import useDeleteComment from "../hooks/mutation/useDeleteComment";
import { QUERY_KEY } from "../constants/key";

const LpDetailPage = () => {
  const { id } = useParams();
  const lpId = Number(id);

  const { data: me } = useGetMyInfo();
  const { mutate: likeMutate } = usePostLike();
  const { mutate: deleteMutate } = useDeleteLike();

  const {
    data: lp,
    isLoading: isLpLoading,
    isError,
  } = useQuery<Lp>({
    queryKey: [QUERY_KEY.lps, lpId],
    queryFn: () => getLpById(id as string),
    enabled: !!id,
  });

  const isLiked = lp?.likes.some((like) => like.userId === me?.data.id);

  const handleClickLike = () => {
    if (!lp || !me?.data || isLiked) return;
    likeMutate({ lpId });
  };

  const handleDeleteLike = () => {
    if (!lp || !me?.data || !isLiked) return;
    deleteMutate({ lpId });
  };

  const [commentInput, setCommentInput] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editingContent, setEditingContent] = useState("");
  const [menuOpenId, setMenuOpenId] = useState<number | null>(null);

  const postCommentMutation = usePostComment(lpId);
  const updateCommentMutation = useUpdateComment(lpId);
  const deleteCommentMutation = useDeleteComment(lpId);

  const {
    data: commentPages,
    isLoading: isCommentLoading,
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage,
  } = useInfiniteComments(lpId, PAGINATION_ORDER.asc);

  const { ref, inView } = useInView();

  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

  const commentList =
    commentPages?.pages.map((page) => page.data.data).flat() ?? [];

  if (isLpLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin" />
      </div>
    );
  }

  if (isError || !lp) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-400 text-xl mb-4">LP 정보를 불러오는 데 실패했습니다.</p>
          <button
            onClick={() => window.history.back()}
            className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all"
          >
            돌아가기
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* 썸네일 이미지 */}
        <div className="relative rounded-2xl overflow-hidden shadow-2xl mb-8 border border-gray-700/50">
          <img
            src={lp.thumbnail}
            alt={lp.title}
            className="w-full h-96 object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
        </div>

        {/* 메인 컨텐츠 */}
        <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl shadow-2xl p-8 border border-gray-700/50 mb-8">
          {/* 제목 및 정보 */}
          <div className="mb-6">
            <h1 className="text-4xl font-bold text-white mb-4 leading-tight">
              {lp.title}
            </h1>
            <div className="flex items-center gap-4 text-sm text-gray-400">
              <span className="flex items-center gap-2">
                <Calendar size={16} />
                {new Date(lp.createdAt).toLocaleDateString()}
              </span>
              {lp.createdAt !== lp.updatedAt && (
                <span className="text-gray-500">
                  (수정: {new Date(lp.updatedAt).toLocaleDateString()})
                </span>
              )}
            </div>
          </div>

          {/* 내용 */}
          <div className="prose prose-invert max-w-none mb-6">
            <p className="text-gray-300 text-lg leading-relaxed whitespace-pre-wrap">
              {lp.content}
            </p>
          </div>

          {/* 태그 */}
          {lp.tags.length > 0 && (
            <div className="mb-6">
              <h3 className="flex items-center gap-2 text-sm font-semibold text-gray-400 mb-3">
                <TagIcon size={16} />
                태그
              </h3>
              <div className="flex flex-wrap gap-2">
                {lp.tags.map((tag) => (
                  <span
                    key={tag.id}
                    className="px-4 py-2 bg-gradient-to-r from-blue-600/20 to-purple-600/20 border border-blue-500/30 text-blue-300 rounded-full text-sm font-medium"
                  >
                    #{tag.name}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* 좋아요 */}
          <div className="pt-6 border-t border-gray-700/50">
            <button
              onClick={isLiked ? handleDeleteLike : handleClickLike}
              className="flex items-center gap-2 px-6 py-3 bg-gray-800 hover:bg-gray-700 rounded-lg transition-all group border border-gray-700"
            >
              <Heart
                className={`w-5 h-5 transition-all ${
                  isLiked
                    ? "text-red-500 fill-red-500"
                    : "text-gray-400 group-hover:text-red-400"
                }`}
              />
              <span className="text-white font-medium">
                좋아요 {lp.likes.length}
              </span>
            </button>
          </div>
        </div>

        {/* 댓글 섹션 */}
        <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl shadow-2xl p-8 border border-gray-700/50">
          <h2 className="text-2xl font-bold text-white mb-6">
            댓글 {commentList.length}개
          </h2>

          {/* 댓글 입력 */}
          {me?.data && (
            <div className="mb-8">
              <textarea
                value={commentInput}
                onChange={(e) => setCommentInput(e.target.value)}
                placeholder="댓글을 입력하세요..."
                className="w-full bg-gray-900/50 text-white border border-gray-700 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 p-4 rounded-xl resize-none outline-none placeholder-gray-500 min-h-[100px]"
              />
              <button
                onClick={() => {
                  if (!commentInput.trim()) return;
                  postCommentMutation.mutate({ lpId, content: commentInput });
                  setCommentInput("");
                }}
                className="mt-3 flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-lg transition-all shadow-lg hover:shadow-blue-500/50"
              >
                <Send size={18} />
                댓글 작성
              </button>
            </div>
          )}

          {/* 댓글 목록 */}
          <div className="space-y-4">
            {isCommentLoading ? (
              <>
                <LpCommentSkeleton />
                <LpCommentSkeleton />
                <LpCommentSkeleton />
              </>
            ) : commentList.length > 0 ? (
              commentList.map((comment) => {
                const isMyComment = comment.authorId === me?.data.id;
                const isEditing = editingId === comment.id;
                return (
                  <div
                    key={comment.id}
                    className="bg-gray-900/50 border border-gray-700/50 rounded-xl p-5 hover:border-gray-600/50 transition-all"
                  >
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <p className="text-white font-semibold mb-1">
                          {comment.author.name}
                        </p>
                        <p className="text-xs text-gray-500">
                          {new Date(comment.createdAt).toLocaleString()}
                        </p>
                      </div>
                      {isMyComment && !isEditing && (
                        <div className="relative">
                          <button
                            onClick={() =>
                              setMenuOpenId((prev) =>
                                prev === comment.id ? null : comment.id
                              )
                            }
                            className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
                          >
                            <MoreVertical size={18} className="text-gray-400" />
                          </button>
                          {menuOpenId === comment.id && (
                            <div className="absolute right-0 mt-2 w-32 bg-gray-800 border border-gray-700 rounded-lg shadow-xl z-10 overflow-hidden">
                              <button
                                onClick={() => {
                                  setEditingId(comment.id);
                                  setEditingContent(comment.content);
                                  setMenuOpenId(null);
                                }}
                                className="flex items-center gap-2 w-full px-4 py-3 hover:bg-gray-700 text-white text-sm transition-colors"
                              >
                                <Pencil size={14} /> 수정
                              </button>
                              <button
                                onClick={() => {
                                  if (confirm("정말 삭제하시겠습니까?")) {
                                    deleteCommentMutation.mutate({
                                      commentId: comment.id,
                                    });
                                    setMenuOpenId(null);
                                  }
                                }}
                                className="flex items-center gap-2 w-full px-4 py-3 hover:bg-gray-700 text-red-400 text-sm transition-colors"
                              >
                                <Trash2 size={14} /> 삭제
                              </button>
                            </div>
                          )}
                        </div>
                      )}
                    </div>

                    {isEditing ? (
                      <div className="space-y-3">
                        <textarea
                          value={editingContent}
                          onChange={(e) => setEditingContent(e.target.value)}
                          className="w-full bg-gray-800 text-white border border-gray-700 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 p-3 rounded-lg resize-none outline-none"
                          rows={3}
                        />
                        <div className="flex gap-2">
                          <button
                            onClick={() => {
                              updateCommentMutation.mutate({
                                commentId: comment.id,
                                content: editingContent,
                              });
                              setEditingId(null);
                            }}
                            className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm transition-all"
                          >
                            저장
                          </button>
                          <button
                            onClick={() => setEditingId(null)}
                            className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg text-sm transition-all"
                          >
                            취소
                          </button>
                        </div>
                      </div>
                    ) : (
                      <p className="text-gray-300 leading-relaxed whitespace-pre-wrap">
                        {comment.content}
                      </p>
                    )}
                  </div>
                );
              })
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-500">아직 댓글이 없습니다.</p>
              </div>
            )}
            <div ref={ref} className="h-4" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default LpDetailPage;