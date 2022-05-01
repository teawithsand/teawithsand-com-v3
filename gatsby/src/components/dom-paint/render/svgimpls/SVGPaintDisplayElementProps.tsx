import PaintElement from "@app/components/dom-paint/element/PaintElement"
import { PaintLayerMetadata } from "@app/components/dom-paint/element/scene/PaintLayer"

type SVGPaintDisplayElementProps<T extends PaintElement> = {
    paintElement: T,
    layerMetadata: PaintLayerMetadata,

    onClick?: (e: unknown) => void,
}

export default SVGPaintDisplayElementProps