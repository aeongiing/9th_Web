import { type PaginationDto } from "../../types/common";
import { useQuery } from "@tanstack/react-query";
import { getLpList } from "../../apis/lp";
import { QUERY_KEY } from "../../constants/key";

function useGetLpList({ cursor, search, limit, order }: PaginationDto) {
  return useQuery({
    queryKey: [QUERY_KEY.lps, search, order],
    queryFn: () => getLpList({ cursor, search, limit, order }),
    //데이터가 신선하다고 간주하는 시간
    // 이 시간동안 캐시된 데이터를 그대로 사용 컴포넌트가 마운트 되거나 창에 포커스 들어오는 경우도 재요청 x
    // 5분동안 기존 데이터를 그대로 사용해서 네트워크 요청을 줄인다.
    staleTime: 1000 * 60 * 5,

    //사용되지 않는 상태인 쿼리데이터가 캐시에 남아있는 시간.
    //staleTime이 지나고 데이터가 신선하지 않더라고, 일정시간동안 메모리에 보관.
    //그 이후에 해당 쿼리가 전혀 사용되지 않으면 gcTime이 지난 후에 제거한다.
    gcTime: 1000 * 60 * 10,

    //조건에 따라 쿼리 실행 여부 제어
    //enabled:Boolean(search),

    //10초마다 쿼리 재요청
    //refetchInterval:100*60,

    //retry:3,

    select: (data) => data.data.data,
  });
}

export default useGetLpList;
