import React from "react"
import ActivateToolData from "@app/Component/DOMPaint/ui/tool/ActivateToolData";
import { ToolActivationResult } from "@app/Component/DOMPaint/ui/tool/ActiveTool";
import Tool from "@app/Component/DOMPaint/ui/tool/Tool";
import { Point } from "@app/Component/DOMPaint/primitive";

export type MoveToolProps = {
    type: "inactive",
} | {
    type: "active",
}

export default class MoveTool implements Tool<MoveToolProps> {
    public readonly initialProps: MoveToolProps = { type: "inactive" }
    public readonly PanelComponent = (props: MoveToolProps) => <></>
    public readonly OverlayComponent = (props: MoveToolProps) => <></>

    activate = (env: ActivateToolData<MoveToolProps>): ToolActivationResult => {
        let wasPressed = false
        let startPressPoint: Point = [0, 0]
        let startScroll: Point = [0, 0]

        return {
            activeTool: {
                close: () => {
                    env.sceneInteraction.setUncommitedMutations([])
                },
                processEvent: (event) => {
                    if (event.type === "mouse") {
                        const parent = env.sceneReference.current
                        if (parent) {
                            try {
                                if (!wasPressed && event.pressed) {
                                    startPressPoint = [...event.screenPoint] as Point
                                    startScroll = [parent.scrollLeft, parent.scrollTop]
                                } else if (event.pressed) {
                                    parent.scrollLeft = Math.min(parent.scrollWidth, Math.max(0, startScroll[0] + (startPressPoint[0] - event.screenPoint[0])))
                                    parent.scrollTop = Math.min(parent.scrollHeight, Math.max(0, startScroll[1] + (startPressPoint[1] - event.screenPoint[1])))
                                }
                            } finally {
                                wasPressed = event.pressed
                            }
                        }
                    }
                }
            }
        }
    }
}