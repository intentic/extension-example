import vue from "@vitejs/plugin-vue";
import { defineConfig, type Rollup, transformWithEsbuild } from "vite";

/* The extension bundle, built exactly as /docs/extensions/build/ prescribes.
 *
 * Two rules are load-bearing and neither is a preference:
 *   externals          — the host publishes its OWN vue, vue-query and extension-api instances through the
 *                        app's import map. Bundling a second copy forks reactivity and the query cache, so the
 *                        view would render from state nothing else in the shell can see.
 *   one file, no chunks — the loader fetches the bundle with an auth header and imports it from a blob: URL.
 *                        A relative chunk import has no base to resolve against there, so it would 404.
 *
 * Two that only make it smaller:
 *   side effects       — @intentic/sandbox-contract (and the @intentic packages it brings in) is schemas and constants,
 *                        nothing that runs on import, but the package does not say so; told here, a bundle keeps only
 *                        the contracts it imports instead of all of them.
 *   whitespace         — vite 7's library build leaves it in, for a downstream bundler this bundle never meets; this
 *                        pass removes it once vite has minified the rest. (vite 8: `output: { minify: true }`.) */
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
