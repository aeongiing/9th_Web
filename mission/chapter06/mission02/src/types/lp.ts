// src/types/lp.ts
export interface Lp {
  id: number;
  title: string;
  thumbnailUrl: string;
  uploadedAt: string;
  likeCount: number;
  viewCount: number;
}

export interface LpDetail extends Lp {
  content: string;
  author: {
    id: number;
    nickname: string;
  };
}

export interface LpListResponse {
  lps: Lp[];
  totalCount: number;
  hasNext: boolean;
}

export interface Comment {
  id: number;
  content: string;
  author: {
    id: number;
    nickname: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface CommentListResponse {
  comments: Comment[];
  totalCount: number;
  hasNext: boolean;
}