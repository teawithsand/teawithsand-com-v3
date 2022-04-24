import PaintElement from "../PaintElement";
import PaintLayer, { PaintLayerMetadata } from "../PaintLayer";
import PaintScene from "./PaintScene";

// TODO(teawithsand): changes detection using event bus + subscribers

export default class PaintSceneImpl implements PaintScene {
    private innerLayers: PaintLayer[] = []

    get layers() {
        return this.innerLayers
    }

    setLayers = (layers: PaintLayer[]): void => {
        this.innerLayers = layers
    }

    setLayer = (i: number, l: PaintLayer): void => {
        this.ensureIthLayer(i)
        this.layers[i] = l
    }

    setLayerMetadata = (i: number, metadata: PaintLayerMetadata): void => {
        this.ensureIthLayer(i)
        this.layers[i].metadata = metadata
    }

    removeLayer = (i: number): void => {
        this.ensureIthLayer(i)

        this.layers.splice(i, 1)
    }

    appendToLayer = (i: number, ...elements: PaintElement[]): void => {
        this.ensureIthLayer(i)
        this.layers[i].elements = [...this.layers[i].elements, ...elements]
    }

    private ensureIthLayer = (i: number) => {
        while (this.layers.length <= i) {
            this.layers.push(new PaintLayer)
        }
    }
}