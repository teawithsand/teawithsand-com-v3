import PaintElement from "./PaintElement"

export class PaintLayer {
    public elements: PaintElement[] = []
    public metadata: PaintLayerMetadata = new PaintLayerMetadata()
}

export class PaintLayerMetadata {
    public isHidden: boolean = false
    public isLocked: boolean = false
    public name: string = ""
}

export default PaintLayer