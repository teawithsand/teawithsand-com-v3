import React from "react"

import ImageSVGElementRender from "@app/components/redux-dom-paint/render/svg/impls/ImageSVGElementRender"
import PathSVGElementRender from "@app/components/redux-dom-paint/render/svg/impls/PathSVGElementRender"
import TextSVGElementRender from "@app/components/redux-dom-paint/render/svg/impls/TextSVGElementRender"
import { SVGElementRenderProps } from "@app/components/redux-dom-paint/render/svg/SVGSceneRender"

export default (props: SVGElementRenderProps<string>) => {
	const { element, ...others } = props
	if (element.type === "path") {
		return <PathSVGElementRender element={element} {...others} />
	} else if (element.type === "image") {
		return <ImageSVGElementRender element={element} {...others} />
	} else if (element.type === "text") {
		return <TextSVGElementRender element={element} {...others} />
	} else {
		throw new Error(
			`Unknown SVG element: ${(element as unknown as any).type}`,
		)
	}
}
