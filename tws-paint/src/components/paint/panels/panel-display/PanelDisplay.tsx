import React, { CSSProperties } from "react";
import styled from "styled-components";



import { ZoomPanel } from "@app/components/paint/panels/zoom-panel/ZoomPanel";
import { overlayPanelZIndex } from "@app/components/paint/pantZAxis";


/**
 * Util for displaying panels on top of paint canvas
 */
export const PanelDisplay = () => {
	return (
		<>
			<PanelDisplayWrapper $align="bottom-left">
				<ZoomPanel />
			</PanelDisplayWrapper>
		</>
	)
}

type PanelAlignment = "top-left" | "bottom-left" | "top-middle"

type PanelDisplayWrapperProps = {
	$align: PanelAlignment
}

const alignToStyles = (align: PanelAlignment): CSSProperties => {
	if (align === "top-left") {
		return {
			top: 0,
			left: 0,
		}
	} else if (align === "bottom-left") {
		return {
			bottom: 0,
			left: 0,
		}
	} else if (align === "top-middle") {
		return {
			top: 0,
			left: "50%",
			transform: `translateX(-50%)`,
		}
	} else {
		throw new Error(`Unsupported alignment ${align as any}`)
	}
}

const PanelDisplayWrapper = styled.div.attrs<PanelDisplayWrapperProps>(
	props => ({
		style: {
			...alignToStyles(props.$align),
		},
	}),
)<PanelDisplayWrapperProps>`
	position: absolute;
	width: fit-content;
	z-index: ${overlayPanelZIndex};
`