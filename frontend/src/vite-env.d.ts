/// <reference types="vite/client" />


interface ImportMetaEnv {
  readonly img_path_appdata: string;
  readonly VITE_PATH: string;
  readonly img_path_medcabIn: string;
}


interface ImportMeta {
  readonly env: ImportMetaEnv;
}