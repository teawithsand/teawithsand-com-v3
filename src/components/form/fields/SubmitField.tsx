import React from "react"
import { useForm } from "react-final-form"

import { FormFieldProps } from "@app/components/form/fieldOptions"
import { useFormClasses } from "@app/components/form/util/FormContext"
import classnames from "@app/util/lang/classnames"

export type CommonSubmitFieldProps = {
	type?: "button" | "submit" // defaults to submit
	className?: string
} & FormFieldProps

const SubmitField = (props: CommonSubmitFieldProps) => {
	const form = useForm()
	const { type, label, id, className, name } = props

	const { formInputClass } = useFormClasses()

	return (
		<div
			className={classnames(
				formInputClass,
				`${formInputClass}__submit`,
				className,
			)}
		>
			<button
				name={name}
				type={type ?? "submit"}
				disabled={form.submitting || form.validating}
				id={id}
			>
				{label}
			</button>
		</div>
	)
}

export default SubmitField
