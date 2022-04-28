import { ToolActivationResult } from "@app/Component/DOMPaint/ui/newtool/ActiveTool"
import ActivateToolData from "@app/Component/DOMPaint/ui/newtool/ActivateToolData"

export default interface Tool<P> {
    readonly PanelComponent: React.FunctionComponent<P>,
    readonly OverlayComponent: React.FunctionComponent<P>,

    activate(data: ActivateToolData<P>): ToolActivationResult<P>
}

