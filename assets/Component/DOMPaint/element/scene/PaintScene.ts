import PaintElement from "../PaintElement";
import PaintLayer, { newEmptyPaintLayerData } from "./PaintLayer";
import PaintSceneMutation from "./PaintSceneMutation";
import PaintSceneQuery from "./PaintSceneQuery";
import RenderHashable from "../RenderHashable";
import { generateUUID } from "@app/util/lang/uuid";
import PaintSceneElementLocator from "./PaintSceneElementLocator";
import { Point } from "../../primitive";
import { EventSourcingAdapter } from "@app/util/lang/eventSourcing";

function insertAt<T>(array: T[], i: number, ...elements: T[]) {
    array.splice(i, 0, ...elements);
}

function removeAt<T>(array: T[], i: number): T {
    return array.splice(i, 1)[0]
}

export type PaintSceneData = {
    layers: PaintLayer[]
}

export const paintSceneEventSourcingAdapter: EventSourcingAdapter<PaintScene, PaintSceneMutation> = {
    applyEvent: (agg, event) => {
        agg.updateWithMutation(event)
    },
    copy: (a) => new PaintScene(a.data)
}

export default class PaintScene implements PaintSceneQuery, RenderHashable<PaintSceneData> {
    private innerRenderHash = generateUUID()

    constructor(private innerData: PaintSceneData) {
        this.innerData = {
            ...innerData,
            layers: [...innerData.layers],
        }
    }

    get renderHash(): string {
        return this.innerRenderHash
    }

    get data(): Readonly<PaintSceneData> {
        return this.innerData
    }

    updateData = (updater: (data: PaintSceneData) => PaintSceneData): void => {
        this.innerRenderHash = generateUUID()
        this.innerData = updater(this.innerData)
    }

    getElementWithLocator = (l: PaintSceneElementLocator, ignoreOutdated = true): PaintElement | null => {
        // TODO(teawithsand): check if locator is up to date + indexes check
        return this.innerData.layers[l.layerIndex].data.elements[l.elementIndex]
    }

    /**
     * Applies mutation given to current paint scene.
     */
    updateWithMutation = (m: PaintSceneMutation) => {
        this.updateData((data) => {
            if (m.type === "push-layer") {
                const layer = new PaintLayer({
                    elements: m.elements,
                    metadata: m.metadata,
                })
                insertAt(data.layers, m.beforeIndex, layer)
            } else if (m.type === "drop-layer") {
                data.layers.splice(m.index, 1)
            } else if (m.type === "move-layer") {
                const layer = removeAt(data.layers, m.index)
                insertAt(data.layers, m.index ?? data.layers.length - 1, layer)
            } else if (m.type === "set-layer-metadata") {
                this.ensureLayerNoNotify(m.index)
                    .updateData((layerData) => {
                        layerData.metadata = m.metadata
                        return layerData
                    })
            } else if (m.type === "drop-layer-elements") {
                if (m.elementIndices.length === 1) {
                    this.ensureLayerNoNotify(m.layerIndex)
                        .updateData((layerData) => {
                            removeAt(layerData.elements, m.elementIndices[0])
                            return layerData
                        })
                } else {
                    const indexSet = new Set(m.elementIndices)
                    this.ensureLayerNoNotify(m.layerIndex)
                        .updateData((layerData) => {
                            layerData.elements = layerData.elements.filter((_, i) => !indexSet.has(i))
                            return layerData
                        })
                }
            } else if (m.type === "push-layer-elements") {
                this.ensureLayerNoNotify(m.layerIndex)
                    .updateData((layerData) => {
                        insertAt(layerData.elements, m.beforeElementIndex ?? layerData.elements.length, ...m.elements)
                        return layerData
                    })
            } else if (m.type === "move-layer-element") {
                let e: PaintElement | null = null

                this.ensureLayerNoNotify(m.sourceLayerIndex)
                    .updateData((layerData) => {
                        e = removeAt(layerData.elements, m.sourceElementIndex)
                        return layerData
                    })

                this.ensureLayerNoNotify(m.destinationLayerIndex)
                    .updateData((layerData) => {
                        insertAt(layerData.elements, m.destinationLayerIndex, e)
                        return layerData
                    })

            } else {
                throw new Error("unknown mutation")
            }

            return data
        })
    }


    getFirstElementAtPoint = (p: Point): PaintSceneElementLocator | null => {
        return null
    }

    private ensureLayerNoNotify = (i: number): PaintLayer => {
        const deltaLayers = i - (this.innerData.layers.length - 1)
        if (deltaLayers > 0) {
            const arr = []

            for (let j = 0; j < deltaLayers; j++)
                arr.push(new PaintLayer(newEmptyPaintLayerData()))

            this.innerData = {
                ...this.innerData,
                layers: [...this.innerData.layers, ...arr]
            }
        }

        return this.innerData.layers[i]
    }
}