/// <reference types="vite/client" />
/// <reference types="@types/highlightjs" />
/// <reference types="@types/markdown-it" />
/// <reference types="@types/lodash-es" />

declare module "*.vue" {
  import { DefineComponent } from "vue";
  // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/ban-types
  const component: DefineComponent<any, {}, any>;
  export default component;
}

interface ImportMetaEnv extends Readonly<Record<string, string>> {
  // Only string type here to avoid hard to debug cast problems in your components!
  readonly VITE_APP_VERSION: string;
  readonly VITE_APP_BUILD_EPOCH?: string;
}
interface ImportMeta {
  readonly env: ImportMetaEnv;
}

import "vue-router";

declare module "vue-router" {
  interface RouteMeta {
    title?: string;
  }
}

export {};