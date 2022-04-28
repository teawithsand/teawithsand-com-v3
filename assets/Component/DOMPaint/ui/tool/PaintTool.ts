import ActivePaintTool from "./ActivePaintTool";
import PaintToolCallbacks from "./PaintToolCallbacks";
import PaintToolEnvironment from "./PaintToolEnvironment";

export default abstract class PaintTool {
    abstract activate(callbacks: PaintToolCallbacks, environment: PaintToolEnvironment): ActivePaintTool
}