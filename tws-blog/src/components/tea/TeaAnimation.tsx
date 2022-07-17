import React, { useEffect, useMemo, useState } from "react"
import styled, { keyframes, css } from "styled-components"

import { wrapNoSSR } from "tws-common/react/components/NoSSR"

const sandAppearKeyframes = (props: {
	appearTime: number
	disappearTime: number
	disappearEndOpacityFraction: number
}) => keyframes`
    0% {
        opacity: 0;
    }
    ${(props.appearTime / props.disappearTime) * 100}% {
        opacity: 1;
    }
    ${(1 - props.appearTime / props.disappearTime) * 100}% {
        opacity: 1;
    }
    100% {
        opacity: ${props.disappearEndOpacityFraction};
    }
`

const sandColorKeyframes = (props: {
	startColor: string
	endColor: string
}) => keyframes`
	0% {
		background-color: ${props.startColor};
	}
	100% {
		background-color: ${props.endColor};
	}
`

const sandFlowKeyframes = (props: {
	startTransformPercent: number
	startSkewPixels: number
	endTransformPercent: number
	endSkewPixels: number
}) => keyframes`
	0% {
		transform: translateY(${-props.startTransformPercent}vh) translateX(${
	props.startSkewPixels
}px);
	}
	100% {
		transform: translateY(${-props.endTransformPercent}vh) translateX(${
	props.endSkewPixels
}px);
	}
`

const sandColumns = 20

const backgroundColor = "orange"
const startTeaColors = [
	"rgb(204, 255, 51)",
	"rgb(255, 204, 102)",
	"rgb(51, 204, 255)",
	"rgb(255, 102, 153)",
	"rgb(200, 101, 132)",
	"rgb(136, 146, 191)",
]

const endTeaColors = startTeaColors

type SandProps = {
	/*
    radiusPixels: number

	flowTimeSeconds: number
	flowTimeFunction: "linear"

	appearTimeFunction: "linear" | "ease-in"
	disappearTimeSeconds: number
	disappearEndOpacityFraction: number

	startHeightPercent: number
	endHeightPercent: number

	delaySeconds: number

	startColor: string
	endColor: string

	skewStart: string
	skewEnd: string
    */

	// General
	$radiusPixels: number

	$sandColumn: number

	// Appearing/disappearing
	$appearTimeSeconds: number
	$disappearTimeSeconds: number
	$disappearEndOpacityFraction: number

	// Color
	$startColor: string
	$endColor: string

	// Flow
	$flowTimeSeconds: number
	$flowOffsetSeconds: number
	$flowSkewStartPixels: number
	$flowSkewEndPixels: number
	$flowStartPositionPercent: number
	$flowEndPositionPercent: number
}

export const TeaContainer = styled.div`
	width: 100vw;
	height: 100vh;
	background-color: ${backgroundColor};

	overflow: hidden;
	user-select: none;

	display: grid;
	grid-template-columns: repeat(
		${sandColumns},
		minmax(0, ${100 / sandColumns}%)
	);
	grid-template-rows: auto;
	place-items: end;

	& > * {
		grid-row: 1;
		grid-column: 1;
	}
`

export const Sand = styled.div.attrs<SandProps>(props => ({
	style: {
		width: props.$radiusPixels,
		height: props.$radiusPixels,
	},
}))<SandProps>`
	border-radius: 100%;
	grid-column: ${props => props.$sandColumn};
	grid-row: 1;

	background-color: ${props => props.$startColor};

	opacity: 0;

	animation: ${props =>
				sandAppearKeyframes({
					appearTime: props.$appearTimeSeconds,
					disappearEndOpacityFraction:
						props.$disappearEndOpacityFraction,
					disappearTime: props.$disappearTimeSeconds,
				})}
			${props => props.$flowTimeSeconds}s
			${props => props.$flowOffsetSeconds}s linear infinite,
		${props =>
				sandColorKeyframes({
					startColor: props.$startColor,
					endColor: props.$endColor,
				})}
			${props => props.$flowTimeSeconds}s
			${props => props.$flowOffsetSeconds}s linear infinite,
		${props =>
				sandFlowKeyframes({
					endSkewPixels: props.$flowSkewEndPixels,
					startSkewPixels: props.$flowSkewStartPixels,
					endTransformPercent: props.$flowEndPositionPercent,
					startTransformPercent: props.$flowStartPositionPercent,
				})}
			${props => props.$flowTimeSeconds}s
			${props => props.$flowOffsetSeconds}s linear infinite;
`

const arrayOfRepeated = <T,>(n: number, g: (i: number) => T): T[] => {
	let res = []
	for (let i = 0; i < n; i++) {
		res.push(g(i))
	}
	return res
}

const randomUniform = (myMin: number, myMax: number) => {
	const [max, min] = [Math.max(myMin, myMax), Math.min(myMin, myMax)]

	return Math.random() * (max - min) + min
}

const randomInt = (min: number, max: number) => {
	return Math.floor(randomUniform(min, max + 1))
}

const randomPick = <T,>(a: T[]): T => {
	if (a.length === 0) throw new Error("no elements to pick")

	return a[Math.floor(Math.random() * a.length)]
}

const TeaAnimation = (props: {}) => {
	// const { sandCount } = props
	const sandCount = 300
	const [displayedSandCount, setDisplayedSandCount] = useState(0)

	useEffect(() => {
		if (displayedSandCount < sandCount) {
			setDisplayedSandCount(
				displayedSandCount +
					Math.min(1, sandCount - displayedSandCount),
			)
		}
	}, [displayedSandCount])

	const parameters: SandProps[] = useMemo(() => {
		const flyTime = randomUniform(5, 7)
		const flyTimeAvg = (5 + 7) / 2

		return arrayOfRepeated<SandProps>(sandCount, () => ({
			$radiusPixels: randomUniform(60, 100),
			$sandColumn: randomInt(0, sandColumns),

			$startColor: randomPick(startTeaColors),
			$endColor: randomPick(endTeaColors),

			$appearTimeSeconds: randomUniform(0.8, 1.5),
			$disappearTimeSeconds: randomUniform(1, 2),
			$disappearEndOpacityFraction: randomUniform(0, 1),

			$flowTimeSeconds: flyTime,

			$flowStartPositionPercent: randomUniform(-10, 0),
			$flowEndPositionPercent: 100,
			$flowOffsetSeconds: randomUniform(-flyTimeAvg, flyTimeAvg),
			$flowSkewStartPixels: randomUniform(-100, 100),
			$flowSkewEndPixels: randomUniform(-30, 30),

			// startSize: randomUniform(60, 100),
			// endSize: randomUniform(60, 100),
			// startColor: randomPick(startTeaColors),
			// endColor: randomPick(endTeaColors),
			// animationTime: randomUniform(-4, 4),
			// startPosition: randomInt(0, sandColumns),
		}))
	}, [sandCount])

	return (
		<TeaContainer>
			{parameters.slice(0, displayedSandCount).map((v, i) => (
				<Sand {...v} key={i} />
			))}
		</TeaContainer>
	)
}

export default wrapNoSSR(TeaAnimation)
