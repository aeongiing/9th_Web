import { useInfiniteQuery } from "@tanstack/react-query";
import { getMyLpList } from "../../apis/lp";
import { QUERY_KEY } from "../../constants/key";
import { PAGINATION_ORDER } from "../../enums/common";

const useGetMyLpList = (
  limit: number,
  order: PAGINATION_ORDER,
  search: string
) => {
  return useInfiniteQuery({
    queryKey: [QUERY_KEY.lps, "my", search],
    queryFn: ({ pageParam }) =>
      getMyLpList({
        cursor: pageParam,
        limit,
        order,
        search,
      }),
    initialPageParam: 0,
    getNextPageParam: (lastPage) =>
      lastPage.data.hasNext ? lastPage.data.nextCursor : undefined,
  });
};

export default useGetMyLpList;