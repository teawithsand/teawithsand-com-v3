
// TODO(teawithsand): instead of using sceneRenderHash use generational indexes for both layer and it's element.

type PaintSceneElementLocator = {
    layerIndex: number,
    elementIndex: number,
    sceneRenderHash: string,
}

export default PaintSceneElementLocator