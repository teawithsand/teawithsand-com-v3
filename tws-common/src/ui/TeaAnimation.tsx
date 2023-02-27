import React, { useEffect, useMemo, useState } from "react"
import styled, { css, keyframes } from "styled-components"
import { wrapNoSSR } from "tws-common/react/components/NoSSR"

const arrayOfRepeated = <T,>(n: number, g: (i: number) => T): T[] => {
	const res = []
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

const sandAppearTimeFractions = arrayOfRepeated(100, () => ({
	appearTime: randomUniform(0.8, 1.5),
	disappearTime: randomUniform(1, 2),
}))

const sandAppearKeyframesArray = sandAppearTimeFractions.map(
	props => keyframes`
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
        opacity: var(--sand-disappear-opacity);
    }
`,
)

const sandColorKeyframes = keyframes`
	0% {
		background-color: var(--sand-start-color);
	}
	100% {
		background-color: var(--sand-end-color);
	}
`

const sandFlowKeyframes = keyframes`
	0% {
		transform: translateY(var(--sand-start-height)) translateX(var(--sand-start-skew));
	}
	100% {
		transform: translateY(var(--sand-end-height)) translateX(var(--sand-end-skew));
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
	// General
	$radiusPixels: number

	$sandColumn: number

	// Appearing/disappearing
	$appearKeyframeIndex: number
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

	background: rgb(224, 150, 91);
	background: linear-gradient(
		90deg,
		rgba(224, 150, 91, 1) 0%,
		rgba(222, 185, 24, 1) 100%
	);

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

	${sandAppearKeyframesArray.map(
		(v, i) => css`
			.sand-${i} {
				animation: ${v} var(--sand-flow-time) var(--sand-offset-time)
						linear infinite,
					${sandColorKeyframes} var(--sand-flow-time)
						var(--sand-offset-time) linear infinite,
					${sandFlowKeyframes} var(--sand-flow-time)
						var(--sand-offset-time) linear infinite;
			}
		`,
	)}
`

export const Sand = styled.div.attrs<SandProps>(props => ({
	style: {
		width: props.$radiusPixels,
		height: props.$radiusPixels,
		gridColumn: props.$sandColumn,
		willChange: "width height",

		"--sand-start-color": props.$startColor,
		"--sand-end-color": props.$endColor,

		"--sand-disappear-opacity": props.$disappearEndOpacityFraction,
		"--sand-flow-time": props.$flowTimeSeconds + "s",
		"--sand-offset-time": props.$flowOffsetSeconds + "s",

		"--sand-start-height": -props.$flowStartPositionPercent + "vh",
		"--sand-end-height": -props.$flowEndPositionPercent + "vh",
		"--sand-start-skew": props.$flowSkewStartPixels + "px",
		"--sand-end-skew": props.$flowSkewEndPixels + "px",

		backgroundColor: props.$startColor,
	},
	className: `sand-${props.$appearKeyframeIndex}`,
}))<SandProps>`
	border-radius: 100%;
	grid-row: 1;
	opacity: 0;
`

const TeaAnimation = (props: { className?: string }) => {
	// const { sandCount } = props
	const sandCount = 400
	const [displayedSandCount, setDisplayedSandCount] = useState(sandCount)

	useEffect(() => {
		if (displayedSandCount < sandCount) {
			setDisplayedSandCount(
				displayedSandCount +
					Math.min(50, sandCount - displayedSandCount),
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

			$appearKeyframeIndex: randomInt(
				0,
				sandAppearKeyframesArray.length - 1,
			),
			$disappearEndOpacityFraction: randomUniform(0, 1),

			$flowTimeSeconds: flyTime,

			$flowStartPositionPercent: randomUniform(-15, -5),
			$flowEndPositionPercent: 100,
			$flowOffsetSeconds: randomUniform(-flyTimeAvg, flyTimeAvg),
			$flowSkewStartPixels: randomUniform(-100, 100),
			$flowSkewEndPixels: randomUniform(-30, 30),
		}))
	}, [sandCount])

	return (
		<TeaContainer className={props.className}>
			{parameters.slice(0, displayedSandCount).map((v, i) => (
				<Sand {...v} key={i} />
			))}
		</TeaContainer>
	)
}

export default wrapNoSSR(TeaAnimation)
