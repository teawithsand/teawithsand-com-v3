import { encodeColor } from "../primitive"
import PaintElementFill from "./PaintElementFill"
import PaintElementStroke from "./PaintElementStroke"

export const renderSvgProps = (props: {
    stroke?: PaintElementStroke | undefined | null,
    fill?: PaintElementFill | undefined | null,
}) => {
    const {
        fill,
        stroke
    } = props
    let style: React.CSSProperties = {}

    if (stroke) {
        style = {
            ...style,
            stroke: encodeColor(stroke.color),
            strokeWidth: stroke.size,
        }
    }


    if (fill) {
        style = {
            ...style,
            fill: encodeColor(fill.color),
        }
    }

    return {
        style,
    }
}