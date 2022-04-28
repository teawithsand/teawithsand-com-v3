import { EventSourcingAdapter } from "@app/util/lang/eventSourcing"
import { PathFillData, PathStrokeData } from "../../element/impls/PathPaintElement"
import PaintElement from "../../element/PaintElement"
import PaintSceneElementLocator from "../../element/scene/PaintSceneElementLocator"
import GlobalUIStateMutator from "./GlobalUIStateMutator"

export type StrokeUIState = PathStrokeData

export type FillUIState = PathFillData

type GlobalUIState = {
    activeLayerIndex: number,
    stroke: StrokeUIState,
    fill: FillUIState | null,

    selectedElements: PaintSceneElementLocator[],
    uncommittedElements: PaintElement[],
}

export const initialUIState: Readonly<GlobalUIState> = {
    stroke: {
        color: [0, 0, 0],
        size: 10,
        linecap: "round",
        linejoin: "round",
    },
    fill: null,
    selectedElements: [],
    activeLayerIndex: 0,
    uncommittedElements: [],
}

export default GlobalUIState


export const uiStateEventSourcingAdapter: EventSourcingAdapter<GlobalUIState, GlobalUIStateMutator> = {
    applyEvent: (agg, e) => e(agg),
    copy: (a) => ({ ...a })
}