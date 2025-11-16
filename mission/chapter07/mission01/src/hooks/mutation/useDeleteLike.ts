import { useMutation } from "@tanstack/react-query";
import { deleteLike } from "../../apis/lp";
import { queryClient } from "../../App";
import { QUERY_KEY } from "../../constants/key";
import { type RequestLpDto } from "../../types/lp";

function useDeleteLike() {
  return useMutation({
    mutationFn: deleteLike,
    onMutate: async ({ lpId }: RequestLpDto) => {
      await queryClient.cancelQueries({ queryKey: [QUERY_KEY.lps, lpId] });

      const previous = queryClient.getQueryData([QUERY_KEY.lps, lpId]);

      queryClient.setQueryData([QUERY_KEY.lps, lpId], (old: any) => ({
        ...old,
        likes: old.likes.filter(
          (like: any) => like.userId !== old.me?.data?.id
        ),
      }));

      return { previous, lpId };
    },
    onError: (_err, _vars, context) => {
      if (context?.previous && context.lpId) {
        queryClient.setQueryData(
          [QUERY_KEY.lps, context.lpId],
          context.previous
        );
      }
    },
    onSettled: (_data, _err, { lpId }) => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY.lps, lpId] });
    },
  });
}

export default useDeleteLike;