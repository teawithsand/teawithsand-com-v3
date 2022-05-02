import PathPaintElement from "@app/components/dom-paint/element/impls/PathPaintElement"
import PaintSceneMutation from "@app/components/dom-paint/element/scene/PaintSceneMutation"
import { Point } from "@app/components/redux-dom-paint/primitive"
import { euclideanDistance } from "@app/components/redux-dom-paint/primitive/calc"
import ActivateToolData from "@app/components/dom-paint/ui/tool/ActivateToolData"
import { ToolActivationResult } from "@app/components/dom-paint/ui/tool/ActiveTool"
import Tool from "@app/components/dom-paint/ui/tool/Tool"
import React from "react"

export type PathToolProps = {
    type: "inactive",
} | {
    type: "active",
}

export default class PathTool implements Tool<PathToolProps> {
    public readonly initialProps: PathToolProps = { type: "inactive" }
    public readonly PanelComponent = (props: PathToolProps) => <></>
    public readonly OverlayComponent = (props: PathToolProps) => <></>

    activate = (env: ActivateToolData<PathToolProps>): ToolActivationResult => {
        let wasPressed = false
        let points: Point[] = []

        const getMutations = (): PaintSceneMutation[] => ([
            {
                type: "push-layer-elements",
                elements: [
                    new PathPaintElement({
                        entries: points.map((v, i) => ({
                            type: i === 0 ? "M" : "L",
                            point: v,
                        })),
                        fill: null,
                        filters: [],
                        stroke: { ...env.globalUIState.lastEvent.stroke },
                    })
                ],
                layerIndex: env.globalUIState.lastEvent.activeLayerIndex,
            }
        ])


        return {
            activeTool: {
                close: () => {
                    env.sceneInteraction.setUncommitedMutations([])
                },
                processEvent: (event) => {
                    if (event.type === "mouse") {
                        try {
                            if (!wasPressed && event.pressed) {
                                points.push(event.canvasPoint)
                                env.sceneInteraction.setUncommitedMutations(getMutations())
                            } else if (wasPressed && event.pressed) {
                                const lastPoint = points[points.length - 1]
                                if (euclideanDistance(event.canvasPoint, lastPoint) >= 1) {
                                    points.push(event.canvasPoint)
                                }

                                env.sceneInteraction.setUncommitedMutations(getMutations())
                            } else if (wasPressed && !event.pressed) {
                                points.push(event.canvasPoint)
                                env.sceneInteraction.commitMutations(getMutations())
                                points = []
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