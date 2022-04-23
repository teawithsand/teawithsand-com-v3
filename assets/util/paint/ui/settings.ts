import { Color } from "../color"

export type PaintGlobalSettings = {
    strokeColor: Color,
    fillColor: Color | null, // do not fill if no fill color
}