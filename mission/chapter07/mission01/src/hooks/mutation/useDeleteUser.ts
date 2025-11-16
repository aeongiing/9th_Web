// src/hooks/mutation/useDeleteUser.ts
import { useMutation } from "@tanstack/react-query";
import { deleteUser } from "../../apis/auth";
import { useLocalStorage } from "../useLocalStorage";
import { LOCAL_STORAGE_KEY } from "../../constants/key";

export default function useDeleteUser() {
  const { removeItem: removeAccessToken } = useLocalStorage(
    LOCAL_STORAGE_KEY.accessToken
  );
  const { removeItem: removeRefreshToken } = useLocalStorage(
    LOCAL_STORAGE_KEY.refreshToken
  );

  return useMutation({
    mutationFn: deleteUser,
    onSuccess: () => {
      removeAccessToken();
      removeRefreshToken();
      alert("회원 탈퇴가 완료되었습니다.");
      window.location.href = "/";
    },
    onError: (error) => {
      console.error("회원 탈퇴 실패:", error);
      alert("회원 탈퇴 중 오류가 발생했습니다.");
    },
  });
}