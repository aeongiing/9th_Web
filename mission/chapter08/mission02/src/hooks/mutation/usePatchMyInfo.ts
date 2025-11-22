// hooks/mutation/usePatchMyInfo.ts
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { patchMyInfo } from "../../apis/auth";
import { QUERY_KEY } from "../../constants/key";
import { type ResponseMyInfoDto } from "../../types/auth";

export default function usePatchMyInfo() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: patchMyInfo,
    onMutate: async (newInfo) => {
      await queryClient.cancelQueries({ queryKey: [QUERY_KEY.myInfo] });
      const previous = queryClient.getQueryData<ResponseMyInfoDto>([
        QUERY_KEY.myInfo,
      ]);

      // 낙관적 업데이트
      queryClient.setQueryData<ResponseMyInfoDto>([QUERY_KEY.myInfo], (old) =>
        old
          ? {
              ...old,
              data: {
                ...old.data,
                ...newInfo,
              },
            }
          : old
      );

      return { previous };
    },

    onError: (_err, _newData, context) => {
      if (context?.previous) {
        queryClient.setQueryData([QUERY_KEY.myInfo], context.previous);
      }
      alert("프로필 수정에 실패했습니다.");
    },

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY.myInfo] });
    },
  });
}