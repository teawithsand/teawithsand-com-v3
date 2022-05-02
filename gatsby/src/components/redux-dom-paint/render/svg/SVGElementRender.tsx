import React from "react"
import PathSVGElementRender from "@app/components/redux-dom-paint/render/svg/impls/PathSVGElementRender"
import { SVGElementRenderProps } from "@app/components/redux-dom-paint/render/svg/SVGSceneRender"
import ImageSVGElementRender from "@app/components/redux-dom-paint/render/svg/impls/ImageSVGElementRender"
import TextSVGElementRender from "@app/components/redux-dom-paint/render/svg/impls/TextSVGElementRender"

export default (props: SVGElementRenderProps<string>) => {
	const { element, ...others } = props
	if (element.type === "path") {
		return <PathSVGElementRender element={element} {...others} />
	} else if (element.type === "image") {
		return <ImageSVGElementRender element={element} {...others} />
	} else if (element.type === "text") {
		return <TextSVGElementRender element={element} {...others} />
	} else {
		throw new Error(`Unknown SVG element: ${(element as unknown as any).type}`)
	}
}
