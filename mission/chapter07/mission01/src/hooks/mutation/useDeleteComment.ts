import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteComment } from "../../apis/comment";
import { QUERY_KEY } from "../../constants/key";

export default function useDeleteComment(lpId: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (params: { commentId: number }) =>
      deleteComment({ lpId, ...params }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY.comments, lpId] });
    },
    onError: (err) => {
      console.error("댓글 삭제 실패:", err);
    },
  });
}