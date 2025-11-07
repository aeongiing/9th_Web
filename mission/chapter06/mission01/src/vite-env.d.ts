/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_BASE_URL: string;
  // 필요한 다른 환경 변수들도 여기 추가
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}