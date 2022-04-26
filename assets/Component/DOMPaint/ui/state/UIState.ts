import { EventSourcingAdapter } from "@app/util/lang/eventSourcing"
import PaintElement from "../../element/PaintElement"
import PaintElementFill from "../../element/PaintElementFill"
import PaintElementStroke from "../../element/PaintElementStroke"
import { Color } from "../../primitive"
import { PaintSceneElementLocator } from "../../scene/PaintSceneQuery"
import UIStateMutator from "./UIStateMutator"

type UIState = {
    stroke: PaintElementStroke,
    fill: PaintElementFill,

    activeLayerIndex: number,

    selectedElements: PaintSceneElementLocator[],
    uncommittedElements: PaintElement[],
}

export const initialUIState: UIState = {
    stroke: {
        color: [0, 0, 0],
        size: 10,
    },
    fill: {
        color: [0, 0, 0],
    },
    selectedElements: [],
    activeLayerIndex: 0,
    uncommittedElements: [],
}

export default UIState


export const uiStateEventSourcingAdapter: EventSourcingAdapter<UIState, UIStateMutator> = {
    applyEvent: (agg, e) => e(agg),
    copy: (a) => ({ ...a })
}