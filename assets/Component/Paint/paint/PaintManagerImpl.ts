import Canvas from "../canvas/Canvas";
import CanvasDrawElement from "../canvas/CanvasDrawElement";
import { CanvasSessionResult } from "../canvas/CanvasSession";
import Layer, { LayerMetadata } from "./Layer";
import PaintElement from "./PaintElement";
import PaintManager from "./PaintManager";

export default class PaintManagerImpl implements PaintManager {
    private layers: Layer[] = []
    private currentLayerIndex: number = 0
    private currentElement: PaintElement | null = null

    private currentSessionResult: CanvasSessionResult | null = null

    constructor(public readonly canvas: Canvas) {
    }

    getLayers = (): readonly Readonly<Layer>[] => {
        return this.layers
    }

    setLayer = (i: number, l: Layer): void => {
        while (this.layers.length <= i) {
            this.layers.push(new Layer)

            // Empty layers are empty, so no need to redraw them
            // since they are empty anyway
            // this.layerRedraw(this.layers.length - 1)
        }
        this.layers[i] = l

        this.layerRedraw(i)
    }

    setLayerMetadata = (i: number, l: LayerMetadata): void => {
        this.layers[i].metadata = l

        // TODO(teawithsand): here trigger redraw only when thats required
        //  not all metadata changes requires redrawing

        this.layerRedraw(i)
    }

    removeLayer = (i: number): void => {
        if (i === this.currentLayerIndex) {
            this.currentLayerIndex = this.layers.length - 1
        } else if (this.currentLayerIndex < i) {
            this.currentLayerIndex -= 1
        }

        this.layers.splice(i, 1)

        if (this.layers.length === 0) {
            this.layers = [new Layer]
        }

        this.fullRedraw()
    }

    setCurrentLayerIndex = (i: number): void => {
        this.currentLayerIndex = i
    }

    getCurrentLayerIndex = (): number => {
        return this.currentLayerIndex
    }

    appendToCurrentLayer = (e: CanvasDrawElement): void => {
        this.layers[this.currentLayerIndex].elements.push(e)
        this.layerRedraw(this.currentLayerIndex)
    }

    setCurrentElement = (element: CanvasDrawElement | null): void => {
        this.currentElement = element

        this.currentElementRedraw()
    }

    close = () => {
        this.releaseCurrentSession()
    }

    private releaseCurrentSession = () => {
        if (this.currentSessionResult !== null) {
            this.currentSessionResult.close()
            this.currentSessionResult = null
        }
    }

    /**
     * Clears canvas and redraws all elements on it.
     */
    private fullRedraw = () => {
        this.releaseCurrentSession()

        const self = this
        function* iter() {
            for (let i = 0; i < self.layers.length; i++) {
                const l = self.layers[i]
                for (let j = 0; j < l.elements.length; j++) {
                    const e = l.elements[j]
                    yield e
                }

                if (i === self.currentLayerIndex) {
                    if (self.currentElement !== null) {
                        yield self.currentElement
                    }
                }
            }
        }

        this.canvas.reset()
        this.currentSessionResult = this.canvas.draw(iter())
    }

    /**
     * Performs redraw, which assumes that only currentElement changed.
     */
    private currentElementRedraw = () => {
        // TODO(teawithsand): optimize me
        this.fullRedraw()
    }

    /**
     * Performs redraw, which assumes that only ith layer has changed.
     */
    private layerRedraw = (i: number) => {
        // TODO(teawithsand): optimize me
        this.fullRedraw()
    }
}