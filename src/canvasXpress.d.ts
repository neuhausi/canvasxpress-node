// Type definitions for canvasxpress
// Project: https://www.canvasxpress.org
// Definitions: https://github.com/neuhausi/canvasXpress-node
//
// The published `canvasxpress` package is a CommonJS/UMD bundle whose
// module.exports is a namespace of { init, cxplot, aes }, where `init` is the
// CanvasXpress constructor. These declarations are intentionally permissive:
// they cover the documented data shape, the constructor, and the common
// instance methods, while leaving the long tail of configuration options and
// methods open via index signatures rather than enumerating hundreds of keys.

export = CanvasXpress;

declare namespace CanvasXpress {
  /**
   * The CanvasXpress data object. The primary numeric matrix lives under `y`;
   * `x` holds per-sample (column) annotations and `z` per-variable (row)
   * annotations. Network/genome/tree graph types carry additional top-level
   * keys, so the shape is left open.
   */
  interface CXData {
    y?: {
      /** Row (variable) identifiers. */
      vars?: Array<string | number>;
      /** Column (sample) identifiers. */
      smps?: Array<string | number>;
      /** Row-major numeric matrix: data[varIndex][smpIndex]. */
      data?: any[][];
      [key: string]: any;
    };
    /** Per-sample (column) annotations, keyed by annotation name. */
    x?: { [annotation: string]: any[] };
    /** Per-variable (row) annotations, keyed by annotation name. */
    z?: { [annotation: string]: any[] };
    [key: string]: any;
  }

  /**
   * CanvasXpress configuration. `graphType` selects the renderer (e.g.
   * "Scatter2D", "Bar", "Heatmap", "Network", "Bump"); every other option is
   * open.
   */
  interface CXConfig {
    graphType?: string;
    colorBy?: string;
    sizeBy?: string;
    shapeBy?: string;
    [option: string]: any;
  }

  /** Event handlers, keyed by CanvasXpress event name (e.g. "click"). */
  interface CXEvents {
    [event: string]: (o?: any, e?: any, t?: any) => void;
  }

  /** A live CanvasXpress chart instance. */
  interface CanvasXpressInstance {
    /** DOM id of the host canvas. */
    target: string;
    /** The instance's data object. */
    data: CXData;
    /** Merge `data` into the chart and redraw. */
    updateData(data: CXData, redraw?: boolean, soft?: boolean, config?: CXConfig): void;
    /** Apply configuration. Pass `noDraw = true` to defer the redraw. */
    updateConfig(config: CXConfig, noDraw?: boolean): void;
    /** Reset configuration to defaults, optionally preserving the named keys. */
    resetConfig(keep?: string[]): void;
    /** Resize the chart. Pass `noDraw = true` to defer the redraw. */
    setDimensions(width: number, height: number, noDraw?: boolean): void;
    /** Tear down the chart and restore the host canvas to the DOM. */
    destroy(target?: string | { target: string }, soft?: boolean): void;
    /** Force a (re)draw. */
    draw(options?: any): void;
    [member: string]: any;
  }

  /** The CanvasXpress constructor (the module's `init` export). */
  interface CanvasXpressConstructor {
    new (
      target: string | object,
      data?: CXData,
      config?: CXConfig,
      events?: CXEvents,
      info?: string,
      afterRender?: any[],
      callback?: (instance: CanvasXpressInstance) => void,
      noValidate?: boolean,
      synchronous?: boolean
    ): CanvasXpressInstance;
    /** All live instances on the page. */
    instances: CanvasXpressInstance[];
    [member: string]: any;
  }

  /** The CanvasXpress constructor. */
  const init: CanvasXpressConstructor;

  /** ggplot-style plotting entry point. */
  function cxplot(
    target: string | object,
    data?: CXData,
    config?: CXConfig,
    events?: CXEvents
  ): CanvasXpressInstance;

  /** Aesthetic-mapping helper used by the cxplot grammar. */
  function aes(...mappings: any[]): any;
}
