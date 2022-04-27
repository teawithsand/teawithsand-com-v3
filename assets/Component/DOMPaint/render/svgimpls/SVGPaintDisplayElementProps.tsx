import PaintElement from "../../element/PaintElement"
import { PaintLayerMetadata } from "../../element/scene/PaintLayer"

type SVGPaintDisplayElementProps<T extends PaintElement> = {
    paintElement: T,
    layerMetadata: PaintLayerMetadata,
}

export default SVGPaintDisplayElementProps