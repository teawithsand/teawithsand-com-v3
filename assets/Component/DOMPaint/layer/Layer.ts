import PaintElement from "../element/PaintElement";
import PaintLayerMetadata from "./LayerMetadata";

export default class PaintLayer {
    constructor(
        public elements: Iterable<PaintElement>,
        public metadata: PaintLayerMetadata,
    ) { }
}