export type PaintUIInput = {
    type: "mouse",
    x: number,
    y: number,
    pressed: boolean,
    pressedToggled: boolean,
} | {
    type: "setting-change",
    data: SettingChangeUIInput,
}

export type SettingChangeUIInput = {}

export default PaintUIInput