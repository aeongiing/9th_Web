// src/hooks/queries/useGetInfiniteComments.ts

import { useInfiniteQuery } from "@tanstack/react-query";
import { axiosInstance } from "../../apis/axios";
import { type CommentListResponse } from "../../types/comment";
import { PAGINATION_ORDER } from "../../enums/common";

export const useInfiniteComments = (lpId: number, order: PAGINATION_ORDER) => {
  return useInfiniteQuery<CommentListResponse, Error>({
    queryKey: ["comments", lpId, order],
    queryFn: ({ pageParam = null }) =>
      axiosInstance
        .get(`/v1/lps/${lpId}/comments`, {
          params: {
            cursor: pageParam,
            limit: 4,
            order,
          },
        })
        .then((res) => res.data),
    getNextPageParam: (lastPage) =>
      lastPage.data.hasNext ? lastPage.data.nextCursor : null,
    initialPageParam: null,
  });
};