import React from "react"
import styled from "styled-components"

import { Button } from "tws-common/ui"
import LinkContainer from "tws-common/ui/LinkContainer"

export type NotFoundErrorExplainerProps = {
	title?: string // defaults come from translations
	buttonText?: string // defaults come from translations
} & (
	| {
			buttonOnClickAction: () => void
			buttonTargetPath?: undefined
	  }
	| {
			buttonOnClickAction?: undefined
			buttonTargetPath: string
	  }
)

const Centered = styled.div`
	display: grid;
	grid-auto-flow: row;
	grid-auto-rows: minmax(0, auto);
	gap: 1em;
`

const NotFoundErrorExplainer = (props: NotFoundErrorExplainerProps) => {
	const { title, buttonText, buttonOnClickAction, buttonTargetPath } = props

	let btn = null

	if (buttonOnClickAction) {
		btn = <Button>{buttonText ?? "Go back"}</Button>
	} else {
		btn = (
			<LinkContainer to={buttonTargetPath}>
				<Button href="#">{buttonText ?? "Go back"}</Button>
			</LinkContainer>
		)
	}

	return (
		<Centered>
			<h1>{title ?? "Not found"}</h1>
			{btn}
		</Centered>
	)
}

export default NotFoundErrorExplainer
