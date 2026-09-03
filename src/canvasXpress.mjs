/**
 * ESM entry for the CanvasXpress browser bundle.
 *
 * CanvasXpress ships as a UMD/global build that runs in a browser or bundler
 * context (it references window/document at load, so it is browser-only). This
 * entry executes that bundle for its side effect and re-exports the global
 * constructor, so `import CanvasXpress from "canvasxpress"` works under bundlers
 * such as Vite, webpack and esbuild, and in Observable. Importing it in a plain
 * Node (non-DOM) runtime throws the same "window is not defined" as the UMD, by
 * design — the library needs a browser environment.
 */
import "./canvasXpress.js";

var CanvasXpress =
  (typeof globalThis !== "undefined" && globalThis.CanvasXpress) ? globalThis.CanvasXpress :
  (typeof window !== "undefined" && window.CanvasXpress) ? window.CanvasXpress :
  (typeof self !== "undefined" ? self.CanvasXpress : undefined);

export { CanvasXpress };
export default CanvasXpress;
