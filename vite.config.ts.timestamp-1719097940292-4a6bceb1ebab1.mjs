// vite.config.ts
import { fileURLToPath, URL } from "node:url";
import { defineConfig } from "file:///mnt/c/Users/23174/Desktop/GitHub%20Project/vue-client/node_modules/.pnpm/vite@https+++registry.npmmirror.com+vite+-+vite-5.2.12.tgz_@types+node@https+++registry.npmmi_7na5n3j2ias6ztkeszhvjr74a4/node_modules/vite/dist/node/index.js";
import vue from "file:///mnt/c/Users/23174/Desktop/GitHub%20Project/vue-client/node_modules/.pnpm/@vitejs+plugin-vue@https+++registry.npmmirror.com+@vitejs+plugin-vue+-+plugin-vue-5.0.4.tgz_v_qor3xrngzt6su4xcbpupt76ac4/node_modules/@vitejs/plugin-vue/dist/index.mjs";
import vueJsx from "file:///mnt/c/Users/23174/Desktop/GitHub%20Project/vue-client/node_modules/.pnpm/@vitejs+plugin-vue-jsx@https+++registry.npmmirror.com+@vitejs+plugin-vue-jsx+-+plugin-vue-jsx_hj6oqljsj6pjjvzoojcw7jbreu/node_modules/@vitejs/plugin-vue-jsx/dist/index.mjs";
import VueDevTools from "file:///mnt/c/Users/23174/Desktop/GitHub%20Project/vue-client/node_modules/.pnpm/vite-plugin-vue-devtools@https+++registry.npmmirror.com+vite-plugin-vue-devtools+-+vite-plugi_a6sje3sqwik7ukslqkhvosklwa/node_modules/vite-plugin-vue-devtools/dist/vite.mjs";
import UnoCSS from "file:///mnt/c/Users/23174/Desktop/GitHub%20Project/vue-client/node_modules/.pnpm/unocss@https+++registry.npmmirror.com+unocss+-+unocss-0.60.3.tgz_postcss@8.4.38_rollup@4.18.0_6jdsijojj6dzrmeyrfnmkprmee/node_modules/unocss/dist/vite.mjs";
var __vite_injected_original_import_meta_url = "file:///mnt/c/Users/23174/Desktop/GitHub%20Project/vue-client/vite.config.ts";
var vite_config_default = defineConfig({
  plugins: [
    vue(),
    vueJsx(),
    VueDevTools(),
    UnoCSS()
  ],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", __vite_injected_original_import_meta_url))
    }
  }
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCIvbW50L2MvVXNlcnMvMjMxNzQvRGVza3RvcC9HaXRIdWIgUHJvamVjdC92dWUtY2xpZW50XCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCIvbW50L2MvVXNlcnMvMjMxNzQvRGVza3RvcC9HaXRIdWIgUHJvamVjdC92dWUtY2xpZW50L3ZpdGUuY29uZmlnLnRzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9tbnQvYy9Vc2Vycy8yMzE3NC9EZXNrdG9wL0dpdEh1YiUyMFByb2plY3QvdnVlLWNsaWVudC92aXRlLmNvbmZpZy50c1wiO2ltcG9ydCB7IGZpbGVVUkxUb1BhdGgsIFVSTCB9IGZyb20gJ25vZGU6dXJsJ1xuXG5pbXBvcnQgeyBkZWZpbmVDb25maWcgfSBmcm9tICd2aXRlJ1xuaW1wb3J0IHZ1ZSBmcm9tICdAdml0ZWpzL3BsdWdpbi12dWUnXG5pbXBvcnQgdnVlSnN4IGZyb20gJ0B2aXRlanMvcGx1Z2luLXZ1ZS1qc3gnXG5pbXBvcnQgVnVlRGV2VG9vbHMgZnJvbSAndml0ZS1wbHVnaW4tdnVlLWRldnRvb2xzJ1xuaW1wb3J0IFVub0NTUyBmcm9tICd1bm9jc3Mvdml0ZSdcblxuXG4vLyBodHRwczovL3ZpdGVqcy5kZXYvY29uZmlnL1xuZXhwb3J0IGRlZmF1bHQgZGVmaW5lQ29uZmlnKHtcbiAgcGx1Z2luczogW1xuICAgIHZ1ZSgpLFxuICAgIHZ1ZUpzeCgpLFxuICAgIFZ1ZURldlRvb2xzKCksXG4gICAgVW5vQ1NTKCksXG4gIF0sXG4gIHJlc29sdmU6IHtcbiAgICBhbGlhczoge1xuICAgICAgJ0AnOiBmaWxlVVJMVG9QYXRoKG5ldyBVUkwoJy4vc3JjJywgaW1wb3J0Lm1ldGEudXJsKSlcbiAgICB9XG4gIH1cbn0pXG4iXSwKICAibWFwcGluZ3MiOiAiO0FBQWdWLFNBQVMsZUFBZSxXQUFXO0FBRW5YLFNBQVMsb0JBQW9CO0FBQzdCLE9BQU8sU0FBUztBQUNoQixPQUFPLFlBQVk7QUFDbkIsT0FBTyxpQkFBaUI7QUFDeEIsT0FBTyxZQUFZO0FBTjZMLElBQU0sMkNBQTJDO0FBVWpRLElBQU8sc0JBQVEsYUFBYTtBQUFBLEVBQzFCLFNBQVM7QUFBQSxJQUNQLElBQUk7QUFBQSxJQUNKLE9BQU87QUFBQSxJQUNQLFlBQVk7QUFBQSxJQUNaLE9BQU87QUFBQSxFQUNUO0FBQUEsRUFDQSxTQUFTO0FBQUEsSUFDUCxPQUFPO0FBQUEsTUFDTCxLQUFLLGNBQWMsSUFBSSxJQUFJLFNBQVMsd0NBQWUsQ0FBQztBQUFBLElBQ3REO0FBQUEsRUFDRjtBQUNGLENBQUM7IiwKICAibmFtZXMiOiBbXQp9Cg==
