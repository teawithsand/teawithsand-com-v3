import PaintElement from "../PaintElement";

/**
 * Changes paint element(and creates shallow copy).
 * It's used to apply transformations like scaling and stuff.
 */
type PaintElementProcessor = (e: PaintElement) => PaintElement

export default PaintElementProcessor