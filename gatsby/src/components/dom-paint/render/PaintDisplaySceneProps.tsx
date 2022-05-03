import PaintElement from "@app/components/dom-paint/element/PaintElement"
import PaintScene from "@app/components/dom-paint/element/scene/PaintScene"

type PaintDisplaySceneProps = {
	scene: PaintScene
	activeLayerIndex: number
	activeLayerElements: PaintElement[]

	style?: React.CSSProperties
	className?: string
}

export default PaintDisplaySceneProps
