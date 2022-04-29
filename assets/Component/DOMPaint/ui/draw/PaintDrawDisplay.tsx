import React, { useMemo, useRef } from "react"
import PaintScene from "@app/Component/DOMPaint/element/scene/PaintScene"
import DrawEvent from "@app/Component/DOMPaint/ui/DrawEvent"
import classnames from "@app/util/lang/classnames"
import { getUsefulDimensions } from "@app/util/react/hook/dimensions/useUsefulDimensions"
import GlobalUIState from "@app/Component/DOMPaint/ui/state/GlobalUIState"

import styles from "./paintDisplay.scss?module"
import SVGPaintDisplayScene from "@app/Component/DOMPaint/render/SVGPaintDisplayScene"
import usePaintDraw from "@app/Component/DOMPaint/ui/draw/usePaintDraw"
import PaintSceneMutation from "@app/Component/DOMPaint/element/scene/PaintSceneMutation"

export type DrawUIEvent = {
    type: "pick-tool",
    tool: "draw" | "scroll",
} | {
    type: "undo",
} | {
    type: "redo",
} | {
    type: "exit"
}

const panelHeight = 150

export default <P extends Object>(props: {
    readonly toolProps: P,
    readonly PanelComponent: React.FunctionComponent<P>,
    readonly OverlayComponent: React.FunctionComponent<P>,
    readonly scene: PaintScene,
    readonly globalUIState: GlobalUIState,

    readonly uncommitedMutations: PaintSceneMutation[],

    readonly parentElementRef?: React.MutableRefObject<HTMLDivElement | null>,

    readonly onDrawEvent: (event: DrawEvent) => void
    readonly onDrawUIEvent: (event: DrawUIEvent) => void,
}) => {
    const { scene: initialScene, uncommitedMutations, onDrawEvent, globalUIState, onDrawUIEvent, PanelComponent, OverlayComponent, toolProps } = props
    const { height, width } = getUsefulDimensions()

    const uiEvent = (e: DrawUIEvent) => {
        if (onDrawUIEvent) onDrawUIEvent(e)
    }

    const maybeParentElementRef = useRef<HTMLDivElement | null>(null)
    const parentElementRef = props.parentElementRef ?? maybeParentElementRef
    const bind = usePaintDraw(parentElementRef, (event) => {
        if (onDrawEvent) {
            onDrawEvent(event)
        }
    })

    const scene = useMemo(() => {
        const ns = new PaintScene(initialScene.data)
        for (const m of uncommitedMutations) {
            ns.updateWithMutation(m)
        }
        return ns
    }, [initialScene, uncommitedMutations])

    return <div
        className={classnames(styles.paintDisplay)}
        style={{
            width: width,
            height: height,
        }}
    >
        <div
            className={styles.paintDisplayCanvasParent}
            ref={parentElementRef}
            {...bind}
            style={{
                height: `100%`,
                width: `100%`,
            }}
        >
            <SVGPaintDisplayScene
                scene={scene}
                activeLayerElements={globalUIState.uncommittedElements}
                activeLayerIndex={globalUIState.activeLayerIndex}
                height={4000}
                width={4000}
            />
        </div>


        {OverlayComponent ? <OverlayComponent {...toolProps} /> : null}

        <div className={classnames(styles.paintDisplayOverlay, styles.paintPanel)}>
            <div className={styles.paintPanelSection}>
                <h6 className={styles.paintPanelSectionTitle}>
                    General
                </h6>
                <a className={classnames(styles.paintPanelButtonPrimary, styles.paintPanelButtonFull)}
                    onClick={() => uiEvent({
                        type: "exit",
                    })}
                >   
                    Go home
                </a>
            </div>
            <div className={classnames(styles.paintPanelSection, styles.paintPanelSectionList)}>
                <h6 className={styles.paintPanelSectionTitle}>
                    Tools
                </h6>
                <button
                    className={classnames(styles.paintPanelButtonPrimary)}
                    onClick={() => {
                        if (onDrawUIEvent) {
                            onDrawUIEvent({
                                type: "pick-tool",
                                tool: "draw",
                            })
                        }
                    }}
                >
                    Draw path
                </button>

                <button
                    className={classnames(styles.paintPanelButtonPrimary)}
                    onClick={() => uiEvent({
                        type: "pick-tool",
                        tool: "scroll",
                    })}
                >
                    Move canvas
                </button>
            </div>

            <div className={classnames(styles.paintPanelSection, styles.paintPanelSectionList)}>
                <h6 className={styles.paintPanelSectionTitle}>
                    Operations
                </h6>
                <button
                    className={classnames(styles.paintPanelButtonPrimary)}
                    onClick={() => onDrawUIEvent({
                        type: "undo",
                    })}
                >
                    Undo
                </button>
                <button
                    className={classnames(styles.paintPanelButtonPrimary)}
                    onClick={() => onDrawUIEvent({
                        type: "redo",
                    })}
                >
                    Redo
                </button>
            </div>

            <div className={classnames(styles.paintPanelSection, styles.paintPanelSectionList)}>
                {PanelComponent ? <PanelComponent {...toolProps} /> : null}
            </div>
        </div>
    </div>
}