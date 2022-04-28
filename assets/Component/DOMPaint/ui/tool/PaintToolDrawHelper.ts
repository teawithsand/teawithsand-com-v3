import { generateUUID } from "@app/util/lang/uuid";
import PaintElement from "../../element/PaintElement";
import PaintToolEnvironment from "./PaintToolEnvironment";

export default class PaintToolDrawHelper {
    private elements: PaintElement[] = []
    constructor(
        private readonly env: PaintToolEnvironment,
    ) { }

    setElements = (elements: PaintElement[]) => {
        this.elements = elements
        this.env.uiState.applyEvent(state => {
            state.uncommittedElements = elements
        })
    }

    commitElements = () => {
        const elements = this.elements
        this.elements = []

        this.env.uiState.applyEvent(state => {
            state.uncommittedElements = []
        })

        if (elements.length > 0) {
            this.env.scene.applyEvent({
                type: "push-layer-elements",
                elements: [...elements],
                layerIndex: this.env.uiState.aggregate.lastEvent.activeLayerIndex,
            })
        }
    }

    commitElementsToNewLayer = () => {
        const elements = this.elements
        this.elements = []

        this.env.uiState.applyEvent(state => {
            state.uncommittedElements = []
        })

        if (elements.length > 0) {
            this.env.scene.applyEvent({
                type: "push-layer",
                elements: [...elements],
                beforeIndex: this.env.uiState.aggregate.lastEvent.activeLayerIndex + 1,
                metadata: {
                    isHidden: false,
                    name: "nl-" + generateUUID(),
                }
            })
        }
    }

    close = () => {
        this.elements = []
        this.env.uiState.applyEvent(state => {
            state.uncommittedElements = []
        })
    }
}