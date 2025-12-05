/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_URL: string;
  // Aquí puedes agregar otras variables si las necesitas en el futuro
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}