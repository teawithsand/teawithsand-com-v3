import { Point } from "@app/Component/DOMPaint/primitive";
import ActivePaintTool from "../ActivePaintTool";
import PaintTool from "../PaintTool";
import PaintToolCallbacks from "../PaintToolCallbacks";
import PaintToolEnvironment from "../PaintToolEnvironment";

export default class ScrollPaintTool extends PaintTool {
    activate = (callbacks: PaintToolCallbacks, environment: PaintToolEnvironment): ActivePaintTool => {
        let wasPressed = false
        let startPressPoint: Point = [0, 0]
        let startScroll: Point = [0, 0]
        return {
            submitUIState: (state) => {

            },
            submitDrawEvent: (event) => {
                if (event.type === "mouse") {
                    const parent = environment.parentElementRef.current
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
            },
            close: () => {

            }
        }
    }
}