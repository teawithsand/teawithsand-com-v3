import ActivateToolData from "@app/components/dom-paint/ui/tool/ActivateToolData"
import { ToolActivationResult } from "@app/components/dom-paint/ui/tool/ActiveTool"

export default interface Tool<P extends Object> {
	readonly initialProps: P
	readonly PanelComponent: React.FunctionComponent<P>
	readonly OverlayComponent: React.FunctionComponent<P>

	activate(data: ActivateToolData<P>): ToolActivationResult
}
