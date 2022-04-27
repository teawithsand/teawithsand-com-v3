import { EventSourcingAdapter } from "@app/util/lang/eventSourcing"
import PaintElement from "../../element/PaintElement"
import PaintSceneElementLocator from "../../element/scene/PaintSceneElementLocator"
import { Color } from "../../primitive"
import UIStateMutator from "./UIStateMutator"

export type StrokeUIState = {
    color: Color,
    size: number
}

export type FillUIState = {
    color: Color,
}

type UIState = {
    activeLayerIndex: number,
    stroke: StrokeUIState,
    fill: FillUIState | null,

    selectedElements: PaintSceneElementLocator[],
    uncommittedElements: PaintElement[],
}

export const initialUIState: UIState = {
    stroke: {
        color: [0, 0, 0],
        size: 10,
    },
    fill: null,
    selectedElements: [],
    activeLayerIndex: 0,
    uncommittedElements: [],
}

export default UIState


export const uiStateEventSourcingAdapter: EventSourcingAdapter<UIState, UIStateMutator> = {
    applyEvent: (agg, e) => e(agg),
    copy: (a) => ({ ...a })
}