import PaintElement from "../../element/PaintElement";
import PaintLayerMetadata from "../../layer/LayerMetadata";
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
        this.env.scene.applyEvent({
            type: "push-layer-elements",
            elements,
            layerIndex: this.env.uiState.aggregate.lastEvent.activeLayerIndex,
        })
    }

    commitElementsToNewLayer = () => {
        const elements = this.elements
        this.elements = []
        this.env.uiState.applyEvent(state => {
            state.uncommittedElements = []
        })
        this.env.scene.applyEvent({
            type: "push-layer",
            elements,
            metadata: new PaintLayerMetadata(),
            beforeIndex: this.env.uiState.aggregate.lastEvent.activeLayerIndex + 1,
        })
    }

    close = () => {
        this.elements = []
        this.env.uiState.applyEvent(state => {
            state.uncommittedElements = []
        })
    }
}