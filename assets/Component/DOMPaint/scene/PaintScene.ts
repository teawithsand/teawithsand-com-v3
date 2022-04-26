import { DefaultPaintElementCollisionChecker } from "../element/operations/PaintElementCollisionChecker";
import PaintElement from "../element/PaintElement";
import PaintLayer from "../layer/Layer";
import PaintLayerMetadata from "../layer/LayerMetadata";
import { Point } from "../primitive";
import PaintSceneMutation from "./PaintSceneMutation";
import PaintSceneQuery, { PaintSceneElementLocator } from "./PaintSceneQuery";

function insertAt<T>(array: T[], i: number, ...elements: T[]) {
    array.splice(i, 0, ...elements);
}

function removeAt<T>(array: T[], i: number): T {
    return array.splice(i, 1)[0]
}

export default class PaintScene implements PaintSceneQuery {
    constructor(public layers: PaintLayer[] = []) {
    }

    private collisionChecker = new DefaultPaintElementCollisionChecker()

    getFirstElementAtPoint = (p: Point): PaintSceneElementLocator | null => {
        let layerIndex = this.layers.length - 1
        for (const l of [...this.layers].reverse()) {
            try {
                let elementIndex = l.elements.length - 1
                for (const e of [...l.elements].reverse()) {
                    try {
                        if (this.collisionChecker.checkPointCollision(p, e)) {
                            return {
                                elementIndex,
                                layerIndex
                            }
                        }
                    } finally {
                        elementIndex--
                    }
                }
            } finally {
                layerIndex--
            }
        }
        return null
    }

    private ensureLayer = (i: number): PaintLayer => {
        while (i >= this.layers.length) {
            this.layers.push(new PaintLayer([], new PaintLayerMetadata()))
        }
        return this.layers[i]
    }

    getElementWithLocator = (l: PaintSceneElementLocator): PaintElement | null => {
        return this.layers[l.layerIndex].elements[l.elementIndex]
    }

    /**
     * Applies mutation given to current paint scene.
     */
    applyMutation = (m: PaintSceneMutation) => {
        if (m.type === "push-layer") {
            const layer = new PaintLayer([], m.metadata)
            insertAt(this.layers, m.beforeIndex, layer)
        } else if (m.type === "drop-layer") {
            this.layers.splice(m.index, 1)
        } else if (m.type === "move-layer") {
            const layer = removeAt(this.layers, m.index)
            insertAt(this.layers, m.index ?? this.layers.length - 1, layer)
        } else if (m.type === "set-layer-metadata") {
            this.ensureLayer(m.index).metadata = m.metadata
        } else if (m.type === "drop-layer-elements") {
            if (m.elementIndices.length === 1) {
                removeAt(this.ensureLayer(m.layerIndex).elements, m.elementIndices[0])
            } else {
                const indexSet = new Set(m.elementIndices)
                const layer = this.ensureLayer(m.layerIndex)
                layer.elements = layer.elements.filter((_, i) => !indexSet.has(i))
            }
        } else if (m.type === "push-layer-elements") {
            const arr = this.ensureLayer(m.layerIndex).elements
            insertAt(arr, m.beforeElementIndex ?? arr.length - 1, ...m.elements)
        } else if (m.type === "move-layer-element") {
            const src = this.ensureLayer(m.sourceLayerIndex)
            const dst = this.ensureLayer(m.destinationLayerIndex)

            const e = removeAt(src.elements, m.sourceElementIndex)
            insertAt(dst.elements, m.destinationLayerIndex, e)
        } else if (m.type === "set-layer-processor") {
            this.ensureLayer(m.index).processor = m.processor
        } else {
            throw new Error("unknown mutation")
        }
    }
}

/*
export default interface PaintScene {
    readonly layers: Iterable<Readonly<PaintLayer>>
}
*/