import React from "react"
import styled from "styled-components"

import { Color, encodeColor } from "tws-common/color"

const Background = styled.div`
	background-image: linear-gradient(45deg, #808080 25%, transparent 25%),
		linear-gradient(-45deg, #808080 25%, transparent 25%),
		linear-gradient(45deg, transparent 75%, #808080 75%),
		linear-gradient(-45deg, transparent 75%, #808080 75%);
	background-size: 20px 20px;
	background-position: 0 0, 0 10px, 10px -10px, -10px 0px;

	background: repeating-conic-gradient(#808080 0% 25%, transparent 0% 50%) 50% /
		20px 20px;
`

const Foreground = styled.div`
	z-index: 1;
	background-color: var(--color-picker-color);
`

const Preview = styled.div.attrs<{
	$color: Color
}>(props => ({
	style: {
		"--color-picker-color": encodeColor(props.$color),
	},
}))<{
	$color: Color
}>`
	display: block;
	position: relative;

	border: 2px solid black;
	overflow: hidden;
	border-radius: 0.25rem;

	width: 3rem;
	height: 2rem;

	& > * {
		position: absolute;
		width: 100%;
		height: 100%;

		top: 0;
		left: 0;
	}
`

export const ColorPreview = (props: { color: Color }) => {
	console.error("previewing color", props.color, encodeColor(props.color))
	return (
		<Preview $color={props.color}>
			<Foreground></Foreground>
			<Background></Background>
		</Preview>
	)
}
