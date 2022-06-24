import React from "react"

import { Alert } from "tws-common/ui"

const ErrorExplainer = (props: { error: any }) => {
	// TODO(teawithsand): make it less rudimentary
	return <Alert variant="danger">An error occurred: {props.error}</Alert>
}

export default ErrorExplainer
