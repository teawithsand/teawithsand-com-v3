import { Point } from "../../primitive"

export type PaintUIInput = {
    type: "mouse",
    x: number,
    y: number,
    point: Point, // should be used in favour of x and y
    pressed: boolean,
} | {
    type: "setting-change",
    data: SettingChangeUIInput,
}

export type SettingChangeUIInput = {}

export default PaintUIInput