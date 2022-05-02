import PaintSceneMutation from "@app/components/dom-paint/element/scene/PaintSceneMutation"
import {
	paintSceneSelector,
	PaintState,
	redoUndoneMutation,
	setTool,
	setUncommittedElements,
	undoCommittedMutation,
} from "@app/components/dom-paint/nui/redux/redux"
import { Point } from "@app/components/dom-paint/primitive"
import SVGPaintDisplayScene from "@app/components/dom-paint/render/SVGPaintDisplayScene"
import usePaintDraw from "@app/components/dom-paint/ui/draw/usePaintDraw"
import DrawEvent from "@app/components/dom-paint/ui/DrawEvent"
import { homePath } from "@app/components/paths"

import classnames from "@app/util/lang/classnames"
import { getUsefulDimensions } from "@app/util/react/hook/dimensions/useUsefulDimensions"
import { navigate } from "gatsby"
import React, { useCallback, useMemo, useRef } from "react"
import { useSelector, useDispatch } from "react-redux"

import * as styles from "./paintDisplay.module.scss"

type ToolData =
	| {
			tool: "path"
			wasPressed: boolean
			points: Point[]
	  }
	| {
			tool: "scroll"
	  }

interface ToolDataRef {
	current: ToolData | null
}

export default (props: {}) => {
	const dispatch = useDispatch()
	const state = useSelector<PaintState, PaintState>(s => s)
	const scene = useMemo(
		() => paintSceneSelector(state),
		[state.initialMutations, state.committedMutations]
	)
	const { height, width } = getUsefulDimensions()

	const parentElementRef = useRef<HTMLDivElement | null>(null)

	const toolData = useRef<ToolData | null>(null)
	if (toolData.current?.tool !== state.tool) {
		toolData.current = null
	}

	const pathTool = (dataRef: ToolDataRef, event: DrawEvent) => {}

	const eventCallback = useCallback(
		(event: DrawEvent) => {
			console.log("NIY", event)
		},
		[state.tool]
	)

	const bind = usePaintDraw(parentElementRef, eventCallback)

	return (
		<div
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
					activeLayerElements={state.uncommittedElements}
					activeLayerIndex={state.activeLayerIndex}
					height={state.sceneHeight}
					width={state.sceneWidth}
				/>
			</div>

			<div
				className={classnames(styles.paintDisplayOverlay, styles.paintPanel)}
			>
				<div className={styles.paintPanelSection}>
					<h6 className={styles.paintPanelSectionTitle}>General</h6>
					<a
						className={classnames(
							styles.paintPanelButtonPrimary,
							styles.paintPanelButtonFull
						)}
						onClick={() => navigate(homePath)}
					>
						Go home
					</a>
				</div>
				<div
					className={classnames(
						styles.paintPanelSection,
						styles.paintPanelSectionList
					)}
				>
					<h6 className={styles.paintPanelSectionTitle}>Tools</h6>
					<button
						className={classnames(styles.paintPanelButtonPrimary)}
						onClick={() => {
							dispatch(setTool("path"))
						}}
					>
						Draw path
					</button>

					<button
						className={classnames(styles.paintPanelButtonPrimary)}
						onClick={() => dispatch(setTool("scroll"))}
					>
						Move canvas
					</button>
				</div>

				<div
					className={classnames(
						styles.paintPanelSection,
						styles.paintPanelSectionList
					)}
				>
					<h6 className={styles.paintPanelSectionTitle}>Operations</h6>
					<button
						className={classnames(styles.paintPanelButtonPrimary)}
						onClick={() => dispatch(undoCommittedMutation())}
					>
						Undo
					</button>
					<button
						className={classnames(styles.paintPanelButtonPrimary)}
						onClick={() => dispatch(redoUndoneMutation())}
					>
						Redo
					</button>
				</div>
			</div>
		</div>
	)
}
