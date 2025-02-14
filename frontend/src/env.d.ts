/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_URL: string
  readonly VITE_ASSETS_URL: string
  readonly VITE_FRONTEND_URL: string
  // Agrega aquí otras variables de entorno si las necesitas
}

interface ImportMeta {
  readonly env: ImportMetaEnv
} 