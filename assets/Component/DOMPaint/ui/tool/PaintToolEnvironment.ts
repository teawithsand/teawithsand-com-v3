import { EventSourcing, NoHistoryEventSourcing } from "@app/util/lang/eventSourcing"
import PaintScene from "../../element/scene/PaintScene"
import PaintSceneMutation from "../../element/scene/PaintSceneMutation"
import GlobalUIState from "../state/GlobalUIState"
import GlobalUIStateMutator from "../state/GlobalUIStateMutator"

type PaintToolEnvironment = {
    readonly parentElementRef: { readonly current: HTMLElement },
    readonly uiState: NoHistoryEventSourcing<GlobalUIState, GlobalUIStateMutator>,
    readonly scene: EventSourcing<PaintScene, PaintSceneMutation>,
}

export default PaintToolEnvironment