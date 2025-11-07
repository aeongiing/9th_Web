import { useQuery } from "@tanstack/react-query";

export const useCustomQuery = <T>(url: string) => {
  return useQuery({
    // 같은 key면 데이터 재사용
    queryKey: [url],

    // 실제 데이터를 가져오는 비동기 함수
    queryFn: async ({ signal }) => {
      const response = await fetch(url, { signal });

      if (!response.ok) {
        throw new Error("에러가 발생했습니다.");
      }

      return response.json() as Promise<T>;
    },

    // 재시도 간격 계산 => 서버 부하를 고려한 딜레이 증가
    retryDelay: (attemptIndex): number => {
      return Math.min(1000 * Math.pow(2, attemptIndex), 30_000);
    },

    // 5분동안 캐시 데이터 그대로 사용
    staleTime: 5 * 60 * 1000,

    // 10분 후 캐시 완전 삭제
    gcTime: 10 * 60 * 1000,
  });
};