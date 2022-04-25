import Canvas from "../../canvas/Canvas";
import { CanvasSessionResult } from "../../canvas/CanvasSession";
import PaintLayer from "../PaintLayer";
import AppendPaintManagerMutation from "./mutation/AppendPaintManagerMutation";
import PaintManagerMutation from "./mutation/PaintManagerMutation";
import ReplacePaintManagerMutation from "./mutation/ReplacePaintManagerMutation";
import PaintScene from "./PaintScene";
import PaintSceneManager from "./PaintSceneManager";

export default class PaintSceneManagerImpl implements PaintSceneManager {
    private lastResult: CanvasSessionResult | null = null
    private mutations: PaintManagerMutation[] = []

    constructor(
        public readonly canvas: Canvas,
        public readonly scene: PaintScene,
    ) { }

    setMutations = (mutations: PaintManagerMutation[]): void => {
        console.log("mutations changed", mutations)
        this.mutations = mutations
    }

    applyMutations = (mutations: PaintManagerMutation[]): void => {
        this.mutations = []
        for (const m of mutations) {
            if (m instanceof AppendPaintManagerMutation) {
                this.scene.setLayer(this.scene.layers.length, new PaintLayer(
                    m.appendElements,
                ))
            } else if (m instanceof ReplacePaintManagerMutation) {
                throw new Error("NIY")
            }
        }
    }

    commit = (): void => {
        console.log("commit")
        
        this.releaseLastResult()
        const layers = this.scene.layers
        const mutations = this.mutations
        function* iter() {
            for (const l of layers) {
                if (l.metadata.isHidden)
                    continue;

                // TODO(teawithsand): integrate mutations into this loop
                for (const e of l.elements) {
                    yield e
                }
            }

            for (const m of mutations) {
                if (m instanceof AppendPaintManagerMutation) {
                    for (const e of m.appendElements) {
                        yield e
                    }
                }
            }
        }
        this.lastResult = this.canvas.draw(iter())
    }

    close = (): void => {
        this.releaseLastResult()
    }

    private releaseLastResult = () => {
        const r = this.lastResult
        if (r) {
            r.close()
            this.lastResult = null
        }
    }

}