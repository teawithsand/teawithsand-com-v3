import { EventSourcing, NoHistoryEventSourcing } from "@app/util/lang/eventSourcing"
import PaintScene from "../../element/scene/PaintScene"
import PaintSceneMutation from "../../element/scene/PaintSceneMutation"
import UIState from "../state/GlobalUIState"
import UIStateMutator from "../state/GlobalUIStateMutator"

type PaintToolEnvironment = {
    readonly parentElementRef: { readonly current: HTMLElement },
    readonly uiState: NoHistoryEventSourcing<UIState, UIStateMutator>,
    readonly scene: EventSourcing<PaintScene, PaintSceneMutation>,
}

export default PaintToolEnvironment