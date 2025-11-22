import { useMutation, useQueryClient } from "@tanstack/react-query";
import { postComment } from "../../apis/comment";

export default function usePostComment(lpId: number) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: postComment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["comments", lpId] });
    },
  });
}