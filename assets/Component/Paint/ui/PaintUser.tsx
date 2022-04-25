import useWindowDimensions from "@app/util/react/hook/windowDimensionsHook"
import React from "react"
import HTMLCanvas from "../canvas/HTMLCanvas"
import PaintElement from "../paint/PaintElement"
import PaintLayer from "../paint/PaintLayer"
import PaintSceneImpl from "../paint/scene/PaintSceneImpl"
import PaintSceneManagerImpl from "../paint/scene/PaintSceneManagerImpl"
import PaintUIInput from "../paint/ui/PaintUIInput"
import PaintUIManagerImpl from "../paint/ui/PaintUIManagerImpl"
import PathPaintTool from "../paint/ui/tool/impls/PathPaintTool"
import PaintElementsCanvas from "./PaintElementsCanvas"
import PaintManagerCanvas from "./PaintManagerCanvas"
import styles from "./paintUser.scss?module"

export default () => {
    const { width, height } = useWindowDimensions()
    const elements: PaintElement[] = [
    ]

    return <div className={styles.paintContainer}>
        <div className={styles.paintContainerLeftPanel}>
            SOME PANEL GOES HERE
            SOME PANEL GOES HERE
            SOME PANEL GOES HERE
            SOME PANEL GOES HERE
            SOME PANEL GOES HERE
        </div>

        <PaintManagerCanvas
            width={width}
            height={height}
            managerFactory={(element) => {
                const canvas = new HTMLCanvas(element)

                const scene = new PaintSceneImpl()
                scene.setLayer(0, new PaintLayer(elements))

                const sceneManager = new PaintSceneManagerImpl(
                    canvas,
                    scene,
                )

                const manager = new PaintUIManagerImpl(
                    sceneManager,
                    {},
                )

                manager.setTool(new PathPaintTool())

                manager.paintSceneManager.commit()

                return manager
            }}

        />
    </div>
}