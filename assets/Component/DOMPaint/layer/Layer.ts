import PaintElement from "../element/PaintElement";
import PaintLayerMetadata from "./LayerMetadata";

export default class PaintLayer {
    constructor(
        public elements: PaintElement[],
        public metadata: PaintLayerMetadata,
    ) { }

    copy = () => new PaintLayer([...this.elements], this.metadata.copy())
}