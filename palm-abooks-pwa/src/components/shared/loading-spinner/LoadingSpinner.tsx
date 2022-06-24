import React from "react"
import styled, { keyframes } from "styled-components"

import LoadingImage from "./loading.svg"

const spinAnimation = keyframes`
from {
	transform: rotate(0deg);
}
to {
	transform: rotate(360deg);
}
`

const SpinnerContainer = styled.div`
	margin-left: auto;
	margin-right: auto;
	width: fit-content;
`

const spinnerSize = 150
const spinnerMargin = (spinnerSize * (Math.sqrt(2) - 1)) / 2

const SpinnerImage = styled(LoadingImage)`
	box-sizing: border-box;
	width: ${spinnerSize}px;
	height: ${spinnerSize}px;
	animation: ${spinAnimation} 2s cubic-bezier(0.1, 0.7, 1, 0.1) infinite;
	margin: ${spinnerMargin}px;
`

const SpinnerText = styled.div`
	text-align: center;
	font-size: 1.5em;
`

export default () => {
	return (
		<SpinnerContainer>
			<SpinnerImage alt={"Loading..."} />
			<SpinnerText>Loading...</SpinnerText>
		</SpinnerContainer>
	)
}
