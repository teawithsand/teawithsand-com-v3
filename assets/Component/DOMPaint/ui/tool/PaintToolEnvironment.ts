import { EventSourcing } from "@app/util/lang/eventSourcing"
import PaintScene from "../../scene/PaintScene"
import PaintSceneMutation from "../../scene/PaintSceneMutation"
import UIState from "../UIState"

type PaintToolEnvironment = {
    readonly parentElementRef: { readonly current: HTMLElement },
    readonly uiState: Readonly<UIState>,
    readonly scene: EventSourcing<PaintScene, PaintSceneMutation>,
}

export default PaintToolEnvironment