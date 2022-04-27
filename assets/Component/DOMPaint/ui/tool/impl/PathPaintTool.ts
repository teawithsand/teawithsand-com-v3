import PathPaintElement from "@app/Component/DOMPaint/element/impls/PathPaintElement";
import { Point } from "@app/Component/DOMPaint/primitive";
import { euclideanDistance } from "@app/Component/DOMPaint/primitive/calc";
import { generateUUID as generateUUID } from "@app/util/lang/uuid";
import ActivePaintTool from "../ActivePaintTool";
import PaintTool from "../PaintTool";
import PaintToolCallbacks from "../PaintToolCallbacks";
import PaintToolDrawHelper from "../PaintToolDrawHelper";
import PaintToolEnvironment from "../PaintToolEnvironment";

export default class PathPaintTool extends PaintTool {
    activate = (callbacks: PaintToolCallbacks, environment: PaintToolEnvironment): ActivePaintTool => {
        let wasPressed = false

        const points: Point[] = []

        const helper = new PaintToolDrawHelper(environment)

        const setElements = () => {
            helper.setElements([
                new PathPaintElement({
                    entries: points.map((v, i) => ({
                        type: i === 0 ? "M" : "L",
                        point: v,
                    })),
                    fill: null,
                    filters: [],
                    stroke: { ...environment.uiState.aggregate.lastEvent.stroke },
                })
            ])
        }

        return {
            submitDrawEvent: (event) => {
                if (event.type === "mouse") {
                    try {
                        if (!wasPressed && event.pressed) {
                            points.push(event.canvasPoint)
                            setElements()
                        } else if (wasPressed && event.pressed) {
                            const lastPoint = points[points.length - 1]
                            if (euclideanDistance(event.canvasPoint, lastPoint) >= 1) {
                                points.push(event.canvasPoint)
                            }

                            setElements()
                        } else if (wasPressed && !event.pressed) {
                            points.push(event.canvasPoint)
                            setElements()

                            helper.commitElements()

                            points.splice(0, points.length)
                        }
                    } finally {
                        wasPressed = event.pressed
                    }
                }
            },
            close: () => {
                helper.close()
            }
        }
    }
}