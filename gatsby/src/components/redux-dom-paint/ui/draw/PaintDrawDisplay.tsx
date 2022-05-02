import { homePath } from "@app/components/paths"
import { PrimPaintScene } from "@app/components/redux-dom-paint/defines/PrimPaintScene"
import SVGSceneRender from "@app/components/redux-dom-paint/render/svg/SVGSceneRender"
import PaintState from "@app/components/redux-dom-paint/ui/redux/PaintState"
import classnames from "@app/util/lang/classnames"
import { useBreakpoint } from "@app/util/react/hook/dimensions/useBreakpoint"
import { getUsefulDimensions } from "@app/util/react/hook/dimensions/useUsefulDimensions"
import { findTransitionClasses } from "@app/util/react/transitionGroupClass"
import { navigate } from "gatsby"
import React, { useEffect, useState } from "react"
import { useDispatch } from "react-redux"
import { useSelector } from "react-redux"
import { CSSTransition, TransitionGroup } from "react-transition-group"

import * as styles from "./paintDisplay.module.scss"

const moveOutClasses = findTransitionClasses("moveOut", styles)

export default () => {
	const { height, width } = getUsefulDimensions()

	const dispatch = useDispatch()

	const scene = useSelector<PaintState, PrimPaintScene>(s => s.scene)
	const [sceneWidth, sceneHeight] = useSelector<PaintState, [number, number]>(
		s => [s.sceneWidth, s.sceneHeight]
	)

	const breakpoint = useBreakpoint()
	const isSuperSmallToShowInnerButton = breakpoint === "sm" || breakpoint === "xs"

	const [isIn, setIsIn] = useState(true)
	return (
		<div
			className={classnames(styles.parentContainer)}
			style={{
				width: width,
				height: height,
			}}
		>
			<div className={styles.paintDisplay}>
				<SVGSceneRender scene={scene} height={sceneHeight} width={sceneWidth} />
			</div>

			{/* TODO(teawithsand): make this pretty appear on small devices, right now it causes style flash */}
			{!isIn || !isSuperSmallToShowInnerButton ? (
				<button
					className={styles.paintDisplayTogglePanel}
					onClick={() => setIsIn(!isIn)}
				>
					Toggle panel
				</button>
			) : null}

			<CSSTransition
				timeout={300}
				in={isIn}
				appear={true}
				classNames={moveOutClasses}
			>
				<div className={classnames(styles.toolsPanel)}>
					{isSuperSmallToShowInnerButton ? (
						<button
							className={styles.toolsPanelTogglePanel}
							onClick={() => setIsIn(!isIn)}
						>
							Toggle panel
						</button>
					) : null}

					<h6 className={styles.paintPanelSectionTitle}>General</h6>
					<a className={styles.basicButton} onClick={() => navigate(homePath)}>
						Go home
					</a>
				</div>
			</CSSTransition>
		</div>
	)
}

/*

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

import { Point } from "@app/components/dom-paint/primitive"
import SVGPaintDisplayScene from "@app/components/dom-paint/render/SVGPaintDisplayScene"
import usePaintDraw from "@app/components/dom-paint/ui/draw/usePaintDraw"
import DrawEvent from "@app/components/dom-paint/ui/DrawEvent"
import { homePath } from "@app/components/paths"
import { paintSceneSelector } from "@app/components/redux-dom-paint/nui/redux/PaintSelectors"
import PaintState from "@app/components/redux-dom-paint/nui/redux/PaintState"

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
*/
