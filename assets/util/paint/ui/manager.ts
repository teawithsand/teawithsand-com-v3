import { DrawableElement } from "../primitive";
import { Layer, ReadOnlyLayer } from "./layer";
import { PaintTool } from "./tool";

/**
 * Creates iterable, which concatenates multiple arrays.
 */
function* concatArrays<T>(...arrays: T[][]) {
    for (const a of arrays) {
        for (const e of a) {
            yield e
        }
    }
}


export default class PaintManager {
    /*
    constructor(
        private tool: PaintTool | null,
        private layers: Layer[] = [
            new Layer,
        ],
        private _currentLayerIndex: number = 0
    ) {
        if (layers.length <= 0) {
            throw new Error("At least one layer must be provided")
        }
    }

    private setCurrentLayer = (i: number) => {
        if (i > this.layers.length) {
            throw new Error(`Invalid layer index: ${i}`)
        }
        this._currentLayerIndex = i
    }

    get currentLayerIndex() {
        return this._currentLayerIndex
    }

    get currentLayer(): ReadOnlyLayer {
        return this.layers[this._currentLayerIndex]
    }

    private get writableCurrentLayer(): Layer {
        return this.layers[this._currentLayerIndex]
    }

    /**
     * Sets new tool to current manager, overriding previous one.
     * / 
    setTool = (tool: PaintTool) => {
        this.tool = tool
    }

    unsetTool = () => {
        this.tool = null
    }

    hasToolSet = () => {
        return this.tool !== null
    }

    modifyLayer = (i: number, mod: (l: Layer) => Layer) => {
        this.layers[i] = mod(this.layers[i])
    }

    /**
     * Adds current element to specified layer
     * /
    commitCurrentElement = () => {
        const ce = this.tool?.getCurrentElement()
        if (ce !== null) {
            const cl = this.writableCurrentLayer
            cl.elements = [
                ...cl.elements,
                ce,
            ]
        }

        this.tool = null
    }

    getDrawableElements = (): Iterable<DrawableElement> => {
        const arrays = this.layers
            .filter(l => !l.isHidden)
            .map((l, i) => {
                if (i === this._currentLayerIndex) {
                    let elements = [...l.elements]
                    const ce = this.tool?.getCurrentElement()
                    if (ce !== null) {
                        elements = [...elements, ce,]
                    }

                    return elements
                } else {
                    return l.elements
                }
            })

        return concatArrays(...arrays)
    }
    */
}