import vue from "@vitejs/plugin-vue";
import { defineConfig, type Rollup, transformWithEsbuild } from "vite";

/* Follow /docs/extensions/build/: externalize host Vue/query/API instances to avoid splitting reactivity and cache state.
 * Emit one file without chunks: authenticated loading imports a blob URL with no base for relative imports.
 * Mark schema/constants-only contract modules side-effect-free for tree shaking, and strip library-build whitespace for a smaller bundle. */
const SIDE_EFFECT_FREE = /[\\/]node_modules[\\/]@intentic[\\/](?:sandbox-contract|base|constants)[\\/]/;
const minifyWhitespace: Rollup.OutputPlugin = {
    name: "minify-whitespace",
    // No source map: the build makes none.
    renderChunk: async (code, chunk) => (await transformWithEsbuild(code, chunk.fileName, { minifyWhitespace: true })).code,
};

export default defineConfig({
    plugins: [vue()],
    build: {
        outDir: "dist",
        lib: { entry: "src/extension.ts", formats: ["es"], fileName: () => "extension.js" },
        rollupOptions: {
            external: ["vue", "@tanstack/vue-query", "@intentic/extension-api", "@intentic/extension-ui"],
            treeshake: { moduleSideEffects: (id: string) => !SIDE_EFFECT_FREE.test(id) },
            output: { inlineDynamicImports: true, plugins: [minifyWhitespace] },
        },
    },
});
