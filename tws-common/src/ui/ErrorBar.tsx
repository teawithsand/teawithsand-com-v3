import React, { ReactNode, useMemo } from "react"
import { Alert } from "react-bootstrap"
import { ErrorExplainer } from "tws-common/misc/error-explainer"

/**
 * Simple error bar, which shows up only if error is truthy.
 * Uses error explainer to display error details if there is any error.
 */
export const ErrorBar = <T extends ReactNode>(props: {
	explainer: ErrorExplainer<T>
	error: any
}) => {
	const { explainer, error } = props

	const explained = useMemo(() => {
		if (error) {
			return explainer(error)
		}
		return <></>
	}, [error])

	if (!error) {
		return <></>
	}

	return <Alert variant="danger">{explained}</Alert>
}
