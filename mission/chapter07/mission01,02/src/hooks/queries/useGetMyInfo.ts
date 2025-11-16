// hooks/queries/useGetMyInfo.ts
import { useQuery } from "@tanstack/react-query";
import { getMyInfo } from "../../apis/auth";
import { QUERY_KEY } from "../../constants/key";

export default function useGetMyInfo() {
  return useQuery({
    queryKey: [QUERY_KEY.myInfo],
    queryFn: getMyInfo,
    staleTime: 1000 * 60 * 5,
  });
}