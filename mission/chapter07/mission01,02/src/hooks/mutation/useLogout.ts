// src/hooks/mutation/useLogout.ts
import { useMutation } from "@tanstack/react-query";
import { postLogout } from "../../apis/auth";
import { useLocalStorage } from "../useLocalStorage";
import { LOCAL_STORAGE_KEY } from "../../constants/key";

export default function useLogout() {
  const { removeItem: removeAccessToken } = useLocalStorage(
    LOCAL_STORAGE_KEY.accessToken
  );
  const { removeItem: removeRefreshToken } = useLocalStorage(
    LOCAL_STORAGE_KEY.refreshToken
  );

  return useMutation({
    mutationFn: postLogout,
    onSuccess: () => {
      removeAccessToken();
      removeRefreshToken();
      alert("Logout successful!");
      window.location.href = "/";
    },
    onError: () => {
      alert("Logout failed. Please try again.");
    },
  });
}