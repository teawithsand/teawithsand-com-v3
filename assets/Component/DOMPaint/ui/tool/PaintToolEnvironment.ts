import { EventSourcing, NoHistoryEventSourcing } from "@app/util/lang/eventSourcing"
import PaintScene from "../../scene/PaintScene"
import PaintSceneMutation from "../../scene/PaintSceneMutation"
import UIState from "../state/UIState"
import UIStateMutator from "../state/UIStateMutator"

type PaintToolEnvironment = {
    readonly parentElementRef: { readonly current: HTMLElement },
    readonly uiState: NoHistoryEventSourcing<UIState, UIStateMutator>,
    readonly scene: EventSourcing<PaintScene, PaintSceneMutation>,
}

export default PaintToolEnvironment