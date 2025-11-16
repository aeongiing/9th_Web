import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateComment } from "../../apis/comment";
import { QUERY_KEY } from "../../constants/key";

export default function useUpdateComment(lpId: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (params: { commentId: number; content: string }) =>
      updateComment({ lpId, ...params }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY.comments, lpId] });
    },
    onError: (err) => {
      console.error("댓글 수정 실패:", err);
    },
  });
}