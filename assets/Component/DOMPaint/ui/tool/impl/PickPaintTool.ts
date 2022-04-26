import { DefaultPaintElementAABB } from "@app/Component/DOMPaint/element/operations/PaintElementAABB";
import { Point } from "@app/Component/DOMPaint/primitive";
import ActivePaintTool from "../ActivePaintTool";
import PaintTool from "../PaintTool";
import PaintToolCallbacks from "../PaintToolCallbacks";
import PaintToolEnvironment from "../PaintToolEnvironment";

export default class PickPaintTool extends PaintTool {
    activate = (callbacks: PaintToolCallbacks, environment: PaintToolEnvironment): ActivePaintTool => {
        let wasPressed = false
        let startPressPoint: Point = [0, 0]
        let startScroll: Point = [0, 0]

        return {
            submitDrawEvent: (event) => {
                if (event.type === "mouse") {
                    try {
                        if (!wasPressed && event.pressed) {
                            const scene = environment.scene.aggregate.lastEvent
                            const locator = scene.getFirstElementAtPoint(event.canvasPoint)
                            if (locator) {
                                const element = scene.getElementWithLocator(locator)
                                if (!element)
                                    throw new Error("element must be found here")
                            }
                        }
                    } finally {
                        wasPressed = event.pressed
                    }
                }
            },
            close: () => {

            }
        }
    }
}