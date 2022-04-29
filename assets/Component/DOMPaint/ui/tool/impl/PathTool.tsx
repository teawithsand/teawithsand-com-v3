import React from "react"
import ActivateToolData from "@app/Component/DOMPaint/ui/tool/ActivateToolData";
import { ToolActivationResult } from "@app/Component/DOMPaint/ui/tool/ActiveTool";
import Tool from "@app/Component/DOMPaint/ui/tool/Tool";
import { Point } from "@app/Component/DOMPaint/primitive";
import PathPaintElement from "@app/Component/DOMPaint/element/impls/PathPaintElement";
import { euclideanDistance } from "@app/Component/DOMPaint/primitive/calc";
import PaintSceneMutation from "@app/Component/DOMPaint/element/scene/PaintSceneMutation";

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