// src/pages/HomePage.tsx
import { PAGINATION_ORDER } from "../enums/common";
import useGetInfiniteLpList from "../hooks/queries/useGetInfiniteLpList";
import { useCallback, useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";
import LpCard from "../components/LpCard/LpCard";
import LpCardSkeletonList from "../components/LpCard/LpCardSkeletonList";
import { Search } from "lucide-react";
import useDebounce from "../hooks/useDebounce";
import useThrottle from "../hooks/useThrottle";

const HomePage = () => {
  const [search, setSearch] = useState("");
  const [scrollCount, setScrollCount] = useState(0);
  
  // useDebounce를 사용하여 검색어를 300ms 지연시킴
  const debouncedSearch = useDebounce(search, 300);
  
  console.log(`[HomePage] 현재 입력값: "${search}", Debounced 값: "${debouncedSearch}"`);
  
  const {
    data: lps,
    isFetching,
    hasNextPage,
    isPending,
    fetchNextPage,
    isError,
  } = useGetInfiniteLpList(10, debouncedSearch, PAGINATION_ORDER.desc);

  const { ref, inView } = useInView({
    threshold: 0,
  });

  // fetchNextPage를 throttle로 감싸서 1초에 한 번만 실행되도록 제한
  const handleFetchNextPage = useCallback(() => {
    if (!isFetching && hasNextPage) {
      const newCount = scrollCount + 1;
      setScrollCount(newCount);
      console.log(`[HomePage] 🔄 fetchNextPage 호출 #${newCount}`);
      fetchNextPage();
    }
  }, [isFetching, hasNextPage, fetchNextPage, scrollCount]);

  // 1초(1000ms) 간격으로 throttle 적용
  const throttledFetchNextPage = useThrottle(handleFetchNextPage, 1000);

  useEffect(() => {
    if (inView) {
      console.log(`[HomePage] 📍 스크롤이 감지 영역에 진입 (inView: true)`);
      throttledFetchNextPage();
    }
  }, [inView, throttledFetchNextPage]);

  if (isError) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-400 text-xl mb-4">에러가 발생했습니다.</p>
          <button 
            onClick={() => window.location.reload()}
            className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all"
          >
            새로고침
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900">
      <div className="container mx-auto px-4 py-8">
        {/* 검색 섹션 */}
        <div className="mb-8">
          <div className="max-w-2xl mx-auto">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                value={search}
                onChange={(e) => {
                  const newValue = e.target.value;
                  console.log(`[HomePage Input] 사용자 입력: "${newValue}"`);
                  setSearch(newValue);
                }}
                placeholder="LP를 검색해보세요..."
                className="w-full bg-gray-800/50 text-white border border-gray-700 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 pl-12 pr-4 py-4 rounded-xl transition-all outline-none placeholder-gray-500"
              />
            </div>
            
            {/* Debounce 상태 표시 (개발용) */}
            {search !== debouncedSearch && (
              <div className="mt-2 text-sm text-yellow-400 text-center">
                ⏳ 검색 대기 중... (입력: "{search}")
              </div>
            )}
            
            {debouncedSearch && (
              <div className="mt-2 text-sm text-blue-400 text-center">
                🔍 검색 중: "{debouncedSearch}"
              </div>
            )}
            
            {/* Throttle 상태 표시 */}
            <div className="mt-2 text-sm text-purple-400 text-center">
              ⚡ 페이지 로드 횟수: {scrollCount}회 (Throttle: 1초 간격)
            </div>
          </div>
        </div>

        {/* LP 그리드 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {isPending && <LpCardSkeletonList count={20} />}
          {lps?.pages
            ?.map((page) => page.data.data)
            ?.flat()
            ?.map((lp) => (
              <LpCard key={lp.id} lp={lp} />
            ))}
          {isFetching && <LpCardSkeletonList count={20} />}
        </div>

        <div ref={ref} className="h-2" />
      </div>
    </div>
  );
};

export default HomePage;