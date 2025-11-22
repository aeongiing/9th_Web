// 작성자 정보
export type Author = {
  id: number;
  name: string;
};

// 개별 댓글
export type Comment = {
  id: number;
  content: string;
  lpId: number;
  authorId: number;
  createdAt: string;
  updatedAt: string;
  author: Author;
};

// 댓글 목록 데이터 (페이지당)
export type CommentListDataResponse = {
  data: Comment[];
  nextCursor: number | null;
  hasNext: boolean;
};

// 전체 응답 래퍼
export type CommentListResponse = {
  status: boolean;
  statusCode: number;
  message: string;
  data: CommentListDataResponse;
};

// 댓글 생성 요청
export type CreateCommentDto = {
  content: string;
};

// 댓글 수정 요청
export type UpdateCommentDto = {
  content: string;
};

// 댓글 단건 응답 (예: 생성, 수정)
export type CommentResponse = {
  status: boolean;
  statusCode: number;
  message: string;
  data: Comment;
};

// 댓글 삭제 응답
export type DeleteCommentResponse = {
  status: boolean;
  statusCode: number;
  message: string;
  data: null;
};