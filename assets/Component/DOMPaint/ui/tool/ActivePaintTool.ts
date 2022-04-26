import DrawEvent from "../DrawEvent";

export default interface ActivePaintTool {
    submitDrawEvent(event: DrawEvent): void
    close(): void
}