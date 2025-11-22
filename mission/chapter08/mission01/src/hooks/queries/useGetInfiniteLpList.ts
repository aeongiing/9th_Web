import { useInfiniteQuery } from "@tanstack/react-query";
import { PAGINATION_ORDER } from "../../enums/common";
import { getLpList } from "../../apis/lp";
import { QUERY_KEY } from "../../constants/key";

function useGetInfiniteLpList(
  limit: number,
  search: string,
  order: PAGINATION_ORDER
) {
  // 검색어를 trim하여 공백만 있는 경우도 체크
  const trimmedSearch = search.trim();
  
  return useInfiniteQuery({
    queryFn: ({ pageParam }) => {
      console.log(`[useGetInfiniteLpList] API 요청 실행 - 검색어: "${trimmedSearch}", cursor: ${pageParam}`);
      return getLpList({ cursor: pageParam, limit, search: trimmedSearch, order });
    },
    // queryKey에 trimmedSearch 사용 (캐싱 최적화)
    queryKey: [QUERY_KEY.lps, trimmedSearch, order],
    initialPageParam: 0,
    getNextPageParam: (lastPage, allPages) => {
      console.log(`[useGetInfiniteLpList] 다음 페이지 확인 - hasNext: ${lastPage.data.hasNext}, nextCursor: ${lastPage.data.nextCursor}`);
      return lastPage.data.hasNext ? lastPage.data.nextCursor : undefined;
    },
    // 빈 검색어일 때는 쿼리 실행 (전체 목록 표시)
    // 검색어가 있을 때만 검색 API 호출
    enabled: true,
    // staleTime: 데이터가 fresh 상태로 유지되는 시간 (5분)
    staleTime: 1000 * 60 * 5,
    // gcTime: 사용되지 않는 캐시 데이터가 메모리에 남아있는 시간 (10분)
    gcTime: 1000 * 60 * 10,
  });
}

export default useGetInfiniteLpList;