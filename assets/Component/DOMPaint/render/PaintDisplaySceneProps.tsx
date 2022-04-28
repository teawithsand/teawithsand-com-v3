import PaintElement from "../element/PaintElement"
import PaintScene from "../element/scene/PaintScene"

type PaintDisplaySceneProps = {
    scene: PaintScene,
    activeLayerIndex: number,
    activeLayerElements: PaintElement[],

    style?: React.CSSProperties,
    className?: string,
}

export default PaintDisplaySceneProps