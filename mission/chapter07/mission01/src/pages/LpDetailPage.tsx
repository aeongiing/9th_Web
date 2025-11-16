import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getLpById } from "../apis/lp";
import { type Lp } from "../types/lp.ts";
import { useInView } from "react-intersection-observer";
import { PAGINATION_ORDER } from "../enums/common";
import { useInfiniteComments } from "../hooks/queries/useGetInfiniteComment";
import LpCommentSkeletonList from "../components/LpCard/LpCommentSkeletonList";
import { Heart, MoreVertical, Pencil, Trash2 } from "lucide-react";
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
  const shouldShowCommentSkeleton =
    (!commentPages && isCommentLoading) || commentList.length === 0;

  if (isLpLoading)
    return <div className="p-6 text-center text-gray-500">LP 로딩 중...</div>;
  if (isError || !lp)
    return (
      <div className="p-6 text-center text-red-500">
        LP 정보를 불러오는 데 실패했습니다.
      </div>
    );

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-10">
      <img
        src={lp.thumbnail}
        alt={lp.title}
        className="w-full h-64 object-cover rounded-2xl shadow-md"
      />

      <div className="space-y-2">
        <h1 className="text-4xl font-extrabold tracking-tight text-gray-800">
          {lp.title}
        </h1>
        <p className="text-sm text-gray-500">
          작성일: {new Date(lp.createdAt).toLocaleString()}
        </p>
        <p className="text-sm text-gray-400">
          수정일: {new Date(lp.updatedAt).toLocaleString()}
        </p>
        <p className="text-gray-700 whitespace-pre-wrap mt-4 leading-relaxed">
          {lp.content}
        </p>
      </div>

      <div>
        <h2 className="text-lg font-semibold mb-2">태그</h2>
        <div className="flex flex-wrap gap-2">
          {lp.tags.length > 0 ? (
            lp.tags.map((tag) => (
              <span
                key={tag.id}
                className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium"
              >
                #{tag.name}
              </span>
            ))
          ) : (
            <span className="text-gray-400">태그 없음</span>
          )}
        </div>
      </div>

      <div>
        <button
          onClick={isLiked ? handleDeleteLike : handleClickLike}
          className="flex items-center gap-2 text-sm text-gray-600 hover:text-red-500 transition"
        >
          <Heart
            className={`w-5 h-5 transition ${
              isLiked ? "text-red-500 fill-red-500" : "text-gray-400"
            }`}
          />
          좋아요 {lp.likes.length}
        </button>
      </div>

      {/* 댓글 입력 */}
      {me?.data && (
        <div className="space-y-2">
          <textarea
            value={commentInput}
            onChange={(e) => setCommentInput(e.target.value)}
            placeholder="댓글을 입력하세요"
            className="w-full border border-gray-300 rounded-lg p-3 focus:outline-blue-400"
          />
          <button
            onClick={() => {
              if (!commentInput.trim()) return;
              postCommentMutation.mutate({ lpId, content: commentInput });
              setCommentInput("");
            }}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            댓글 작성
          </button>
        </div>
      )}

      {/* 댓글 목록 */}
      <div className="space-y-4">
        {shouldShowCommentSkeleton ? (
          <LpCommentSkeletonList count={5} />
        ) : (
          commentList.map((comment) => {
            const isMyComment = comment.authorId === me?.data.id;
            const isEditing = editingId === comment.id;
            return (
              <div
                key={comment.id}
                className="border rounded-xl p-4 bg-white shadow-sm relative"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm font-semibold text-gray-700">
                      {comment.author.name}
                    </p>
                    <p className="text-xs text-gray-400">
                      {new Date(comment.createdAt).toLocaleString()}
                    </p>
                  </div>
                  {isMyComment && (
                    <div className="relative">
                      <button
                        onClick={() =>
                          setMenuOpenId((prev) =>
                            prev === comment.id ? null : comment.id
                          )
                        }
                        className="text-gray-500 hover:text-gray-800"
                      >
                        <MoreVertical size={18} />
                      </button>
                      {menuOpenId === comment.id && (
                        <div className="absolute right-0 mt-2 w-24 bg-white border rounded shadow-md z-10">
                          <button
                            onClick={() => {
                              setEditingId(comment.id);
                              setEditingContent(comment.content);
                              setMenuOpenId(null);
                            }}
                            className="flex items-center w-full px-3 py-2 hover:bg-gray-100 text-sm"
                          >
                            <Pencil size={14} className="mr-2" /> 수정
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
                            className="flex items-center w-full px-3 py-2 hover:bg-gray-100 text-sm text-red-500"
                          >
                            <Trash2 size={14} className="mr-2" /> 삭제
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {isEditing ? (
                  <div className="mt-2 space-y-2">
                    <textarea
                      value={editingContent}
                      onChange={(e) => setEditingContent(e.target.value)}
                      className="w-full border border-gray-300 rounded-lg p-2"
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
                        className="px-3 py-1 bg-green-500 text-white rounded"
                      >
                        저장
                      </button>
                      <button
                        onClick={() => setEditingId(null)}
                        className="px-3 py-1 bg-gray-300 rounded"
                      >
                        취소
                      </button>
                    </div>
                  </div>
                ) : (
                  <p className="mt-2 text-gray-700 whitespace-pre-wrap">
                    {comment.content}
                  </p>
                )}
              </div>
            );
          })
        )}
        <div ref={ref} className="h-2" />
      </div>
    </div>
  );
};

export default LpDetailPage;