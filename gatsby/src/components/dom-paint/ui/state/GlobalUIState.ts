import {
	PathFillData,
	PathStrokeData,
} from "@app/components/dom-paint/element/impls/PathPaintElement"
import PaintElement from "@app/components/dom-paint/element/PaintElement"
import PaintSceneElementLocator from "@app/components/dom-paint/element/scene/PaintSceneElementLocator"
import GlobalUIStateMutation from "@app/components/dom-paint/ui/state/GlobalUIStateMutation"
import { EventSourcingAdapter } from "@app/util/lang/eventSourcing"

export type StrokeUIState = PathStrokeData

export type FillUIState = PathFillData

type GlobalUIState = {
	activeLayerIndex: number
	stroke: StrokeUIState
	fill: FillUIState | null

	selectedElements: PaintSceneElementLocator[]
	uncommittedElements: PaintElement[]
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

export const globalUIStateEventSourcingAdapter: EventSourcingAdapter<
	GlobalUIState,
	GlobalUIStateMutation
> = {
	applyEvent: (agg, e) => e(agg),
	copy: a => ({ ...a }),
}
