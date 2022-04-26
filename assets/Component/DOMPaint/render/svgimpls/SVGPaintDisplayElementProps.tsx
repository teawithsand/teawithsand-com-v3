import PaintElement from "../../element/PaintElement"
import PaintLayerMetadata from "../../layer/LayerMetadata"

type SVGPaintDisplayElementProps<T extends PaintElement> = {
    paintElement: T,
    layerMetadata: PaintLayerMetadata,
}

export default SVGPaintDisplayElementProps