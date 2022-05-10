import React from "react"

import { useFormClasses } from "@app/components/form/util/FormContext"

/**
 * Default implementation of displaying validation error.
 */
const ValidationError = (props: { error: any }) => {
	const { error } = props
	const { formInputValidationErrorClass } = useFormClasses()
	return <div className={formInputValidationErrorClass}>{error}</div>
}

export default ValidationError
