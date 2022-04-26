import PaintElement from "../element/PaintElement";
import PaintElementProcessor from "../element/processor/PaintElementProcessor";
import PaintLayerMetadata from "./LayerMetadata";

export default class PaintLayer {
    constructor(
        public elements: PaintElement[],
        public metadata: PaintLayerMetadata,
        public processor?: PaintElementProcessor,
    ) { }
}