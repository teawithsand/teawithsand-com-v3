import React from "react"
import PaintScene from "@app/Component/DOMPaint/element/scene/PaintScene"
import DrawEvent from "@app/Component/DOMPaint/ui/DrawEvent"
import classnames from "@app/util/lang/classnames"
import { useRef } from "react-dom/node_modules/@types/react"
import { getUsefulDimensions } from "@app/util/react/hook/dimensions/useUsefulDimensions"
import GlobalUIState from "@app/Component/DOMPaint/ui/state/GlobalUIState"

import styles from "./paintDisplay.scss?module"
import SVGPaintDisplayScene from "@app/Component/DOMPaint/render/SVGPaintDisplayScene"
import usePaintDraw from "@app/Component/DOMPaint/ui/draw/usePaintDraw"

export type DrawUIEvent = {
    type: "pick-tool",
    tool: "draw" | "scroll",
} | {
    type: "undo",
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

    readonly parentElementRef?: React.MutableRefObject<HTMLDivElement | null>,

    readonly onDrawEvent: (event: DrawEvent) => void
    readonly onDrawUIEvent: (event: DrawUIEvent) => void,
}) => {
    const { scene, onDrawEvent, globalUIState, onDrawUIEvent, PanelComponent, OverlayComponent, toolProps } = props
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


        <OverlayComponent {...toolProps} />

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
            </div>

            <div className={classnames(styles.paintPanelSection, styles.paintPanelSectionList)}>
                <PanelComponent {...toolProps} />
            </div>
        </div>
    </div>
}