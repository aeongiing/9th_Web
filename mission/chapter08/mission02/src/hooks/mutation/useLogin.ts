// hooks/mutation/useLogin.ts
import { useMutation } from "@tanstack/react-query";
import { postSignin } from "../../apis/auth";
import { useAuth } from "../../context/AuthContext";

export default function useLogin() {
  return useMutation({
    mutationFn: postSignin,
    onSuccess: (data) => {
      // 토큰 저장 로직
      alert("Login successful!");
      window.location.href = "/my";
    },
    onError: () => {
      alert("Login failed. Please try again.");
    },
  });
}