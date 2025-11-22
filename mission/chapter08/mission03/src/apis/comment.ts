import { axiosInstance } from "./axios";
import type {
  CreateCommentDto,
  UpdateCommentDto,
  CommentResponse,
  DeleteCommentResponse,
  CommentListResponse,
} from "../types/comment";

// 댓글 목록 조회 (무한스크롤)
export const getComments = async (lpId: number, cursor?: number) => {
  const { data } = await axiosInstance.get<CommentListResponse>(
    `/v1/lps/${lpId}/comments`,
    {
      params: { cursor },
    }
  );
  return data;
};

// 댓글 작성
export const postComment = async ({
  lpId,
  content,
}: { lpId: number } & CreateCommentDto) => {
  const { data } = await axiosInstance.post<CommentResponse>(
    `/v1/lps/${lpId}/comments`,
    { content }
  );
  return data;
};

export const updateComment = async ({
  lpId,
  commentId,
  content,
}: {
  lpId: number;
  commentId: number;
  content: string;
}) => {
  const { data } = await axiosInstance.patch(
    `/v1/lps/${lpId}/comments/${commentId}`,
    { content }
  );
  return data;
};

// 댓글 삭제
export const deleteComment = async ({
  lpId,
  commentId,
}: {
  lpId: number;
  commentId: number;
}) => {
  const { data } = await axiosInstance.delete(
    `/v1/lps/${lpId}/comments/${commentId}`
  );
  return data;
};