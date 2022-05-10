import React from "react"

export type FormFieldInvalidData = {
	messages: string[]
}

export type FormFieldProps = {
	/**
	 * HTML name to use(not to be mistaken with label)
	 */
	name: string

	/**
	 * Field ID to use(if any)
	 */
	id?: string

	/**
	 * Label to display(if any)
	 */
	label?: string
}

export type FormField<T extends FormFieldProps> = React.FC<T>
