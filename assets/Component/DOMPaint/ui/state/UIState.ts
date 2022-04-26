import { EventSourcingAdapter } from "@app/util/lang/eventSourcing"
import PaintElement from "../../element/PaintElement"
import { Color } from "../../primitive"
import { PaintSceneElementLocator } from "../../scene/PaintSceneQuery"
import UIStateMutator from "./UIStateMutator"

type UIState = {
    strokeColor: Color,
    fillColor: Color,

    activeLayerIndex: number,

    selectedElements: PaintSceneElementLocator[],
    uncommittedElements: PaintElement[],
}

export const initialUIState: UIState = {
    strokeColor: [0, 0, 0],
    fillColor: [0, 0, 0],
    selectedElements: [],
    activeLayerIndex: 0,
    uncommittedElements: [],
}

export default UIState


export const uiStateEventSourcingAdapter: EventSourcingAdapter<UIState, UIStateMutator> = {
    applyEvent: (agg, e) => e(agg),
    copy: (a) => ({ ...a })
}