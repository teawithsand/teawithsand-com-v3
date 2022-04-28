import React, { useRef } from "react"

import usePaintDraw from "./usePaintDraw"
import classnames from "@app/util/lang/classnames"
import { getUsefulDimensions } from "@app/util/react/hook/dimensions/useUsefulDimensions"

import styles from "./paintDisplay.scss?module"
import { Link } from "react-router-dom"
import { homePath } from "@app/Component/endpoints"
import SVGPaintDisplayScene from "../../render/SVGPaintDisplayScene"
import PaintScene from "../../element/scene/PaintScene"
import DrawEvent from "../DrawEvent"
import GlobalUIState from "../state/GlobalUIState"

const panelHeight = 150

export type PaintDrawUIEvent = {
    type: "pick-tool",
    tool: "draw" | "scroll",
} | {
    type: "undo",
}

export default (props: {
    className?: string,
    style?: React.CSSProperties,
    scene: PaintScene,

    parentElementRef?: React.MutableRefObject<HTMLDivElement | null>,

    uiState: GlobalUIState,
    onDrawEvent?: (event: DrawEvent) => void,
    onPaintDrawUIEvent?: (event: PaintDrawUIEvent) => void,
}) => {
    const { scene, onDrawEvent, uiState, onPaintDrawUIEvent } = props
    const { height, width } = getUsefulDimensions()

    const maybeParentElementRef = useRef<HTMLDivElement | null>(null)
    const parentElementRef = props.parentElementRef ?? maybeParentElementRef
    const bind = usePaintDraw(parentElementRef as any, (event) => {
        if (onDrawEvent) {
            onDrawEvent(event)
        }
    })

    return <div
        className={classnames(styles.paintDisplay, props.className)}
        style={{
            ["--panel-height" as any]: `${panelHeight}px`,
            ["--header-height" as any]: `0px`,
            width: width,
            height: height,
            ...(props.style ?? {})
        }}
    >
        <div 
            className={styles.paintDisplayCanvasParent}
            ref={parentElementRef as any as React.MutableRefObject<HTMLDivElement>}
            {...bind}
            style={{
                height: `${height - panelHeight}px`,
                width: width,
            }}
        >
            <SVGPaintDisplayScene
                scene={scene}
                activeLayerElements={uiState.uncommittedElements}
                activeLayerIndex={uiState.activeLayerIndex}
                height={4000}
                width={4000}
            />
        </div>


        <div className={classnames(styles.paintDisplayOverlay, styles.paintPanel)}>
            <div className={styles.paintPanelSection}>
                <h6 className={styles.paintPanelSectionTitle}>
                    General
                </h6>
                <Link className={classnames(styles.paintPanelButtonPrimary, styles.paintPanelButtonFull)} to={homePath}>Go home</Link>
            </div>
            <div className={classnames(styles.paintPanelSection, styles.paintPanelSectionList)}>
                <h6 className={styles.paintPanelSectionTitle}>
                    Tools
                </h6>
                <button
                    className={classnames(styles.paintPanelButtonPrimary)}
                    onClick={() => {
                        if (onPaintDrawUIEvent) {
                            onPaintDrawUIEvent({
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
                    onClick={() => {
                        if (onPaintDrawUIEvent) {
                            onPaintDrawUIEvent({
                                type: "pick-tool",
                                tool: "scroll",
                            })
                        }
                    }}
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
                    onClick={() => {
                        if (onPaintDrawUIEvent) {
                            onPaintDrawUIEvent({
                                type: "undo",
                            })
                        }
                    }}
                >
                    Undo
                </button>
            </div>
        </div>
    </div>
}