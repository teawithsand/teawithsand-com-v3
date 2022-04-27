import PaintElement from "../../element/PaintElement"
import { PaintLayerMetadata } from "../../element/scene/PaintLayer"

type SVGPaintDisplayElementProps<T extends PaintElement> = {
    paintElement: T,
    layerMetadata: PaintLayerMetadata,

    onClick?: (e: unknown) => void,
}

export default SVGPaintDisplayElementProps