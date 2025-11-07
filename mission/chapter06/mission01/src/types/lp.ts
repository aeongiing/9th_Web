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