import React from "react"
import styled from "styled-components"

import { reactAppErrorExplainer } from "@app/domain/error/explainer"

import { ErrorBar } from "tws-common/ui/ErrorBar"

const ErrorParent = styled.div`
	display: grid;
	grid-auto-flow: row;
	grid-template-columns: 1fr;
	grid-auto-rows: auto;
`

const ErrorRenderer = (props: { errors: any[] }) => {
	const { errors } = props
	if (errors.length === 0) {
		return <></>
	}
	return (
		<ErrorParent>
			{errors.map((e, i) => (
				<ErrorBar
					key={i}
					error={e}
					explainer={reactAppErrorExplainer}
				/>
			))}
		</ErrorParent>
	)
}

export default ErrorRenderer
