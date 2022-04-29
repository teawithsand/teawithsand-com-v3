import { ToolActivationResult } from "@app/Component/DOMPaint/ui/tool/ActiveTool"
import ActivateToolData from "@app/Component/DOMPaint/ui/tool/ActivateToolData"

export default interface Tool<P extends Object> {
    readonly initialProps: P
    readonly PanelComponent: React.FunctionComponent<P>,
    readonly OverlayComponent: React.FunctionComponent<P>,

    activate(data: ActivateToolData<P>): ToolActivationResult
}

