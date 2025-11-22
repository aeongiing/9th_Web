import { useMutation } from "@tanstack/react-query";
import { createLp } from "../../apis/lp";
import { queryClient } from "../../App";
import { type CreateLpDto } from "../../types/lp";
import { QUERY_KEY } from "../../constants/key";

export default function useCreateLp() {
  return useMutation({
    mutationFn: (body: CreateLpDto) => createLp(body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY.lps, "my"] });
    },
  });
}