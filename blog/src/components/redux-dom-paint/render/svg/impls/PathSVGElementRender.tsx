import React, { useMemo } from "react"

import { SVGElementRenderProps } from "@app/components/redux-dom-paint/render/svg/SVGSceneRender"
import { encodeColor } from "tws-common/color"

const PathSVGElementRender = (props: SVGElementRenderProps<"path">) => {
	const { element } = props

	const stringPath = useMemo(
		() =>
			element.data.entries
				.map(e => {
					if (e.type === "M" || e.type === "L") {
						return `${e.type} ${e.point[0]},${e.point[1]}`
					} else if (e.type === "Z") {
						return "Z"
					}
				})
				.join(" "),
		[element.data.entries],
	)

	const style = useMemo(() => {
		const res: React.CSSProperties = {}

		const { fill, stroke } = element.data

		if (fill) {
			res.fill = encodeColor(fill.color)
		} else {
			res.fill = "none"
		}

		res.stroke = encodeColor(stroke.color)
		res.strokeWidth = stroke.size
		res.strokeLinecap = stroke.linecap
		res.strokeLinejoin = stroke.linejoin

		return res
	}, [element.data.fill, element.data.stroke])

	return (
		<path
			d={stringPath}
			style={style}
			onClick={props.onClick}
			className={props.className}
			onDragStart={e => {
				e.preventDefault()
				return false
			}}
			onDrag={e => {
				e.preventDefault()
				return false
			}}
		/>
	)
}
export default PathSVGElementRender
