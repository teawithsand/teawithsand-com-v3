import PaintElement from "./PaintElement"

export class Layer {
    public elements: PaintElement[] = []
    public metadata: LayerMetadata = new LayerMetadata()
}

export class LayerMetadata {
    public isHidden: boolean = false
    public isLocked: boolean = false
    public name: string = ""
}

export default Layer