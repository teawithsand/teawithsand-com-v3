import PaintElement from "./PaintElement"

export class PaintLayer {
    constructor(
        public elements: PaintElement[] = [],
        public metadata: PaintLayerMetadata = new PaintLayerMetadata()
    ) { }
}

export class PaintLayerMetadata {
    constructor(
        public isHidden: boolean = false,
        public isLocked: boolean = false,
        public name: string = "",
    ) { }
}

export default PaintLayer