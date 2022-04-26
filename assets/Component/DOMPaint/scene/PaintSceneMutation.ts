import PaintElement from "../element/PaintElement"
import PaintElementProcessor from "../element/processor/PaintElementProcessor"
import PaintLayerMetadata from "../layer/LayerMetadata"

type LayerMutation = {
    type: "drop-layer",
    index: number
} | {
    type: "push-layer",
    beforeIndex: number,
    metadata: PaintLayerMetadata,
} | {
    type: "move-layer",
    index: number,
    beforeIndex?: number | undefined,
} | {
    type: "set-layer-metadata",
    index: number,
    metadata: PaintLayerMetadata,
} | {
    // TODO(teawithsand): drop this, since it's not serializable easily to JSON
    type: "set-layer-processor",
    index: number,
    processor: PaintElementProcessor,
}

type ElementMutation = {
    type: "push-layer-elements",
    layerIndex: number,
    beforeElementIndex?: number | undefined,
    elements: PaintElement[],
} | {
    type: "drop-layer-elements",
    layerIndex: number,
    elementIndices: number[],
} | {
    type: "move-layer-element",
    sourceLayerIndex: number,
    sourceElementIndex: number,
    destinationLayerIndex: number,
    beforeDestinationElementIndex: number,
}

type PaintSceneMutation = LayerMutation | ElementMutation

export default PaintSceneMutation