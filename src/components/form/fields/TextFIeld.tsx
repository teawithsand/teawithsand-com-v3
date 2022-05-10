import React, { useMemo } from "react"
import { Field } from "react-final-form"

import "@app/components/form/classes"
import { FormFieldProps } from "@app/components/form/fieldOptions"
import { useFormClasses } from "@app/components/form/util/FormContext"
import ValidationError from "@app/components/form/util/ValidationError"
import classnames from "@app/util/lang/classnames"
import { generateUUID } from "@app/util/lang/uuid"

export type CommonTextFieldProps = {
	placeholder?: string
	required?: boolean
	type?: "text" | "textarea" // defaults to text
	className?: string
} & FormFieldProps

const TextField = (props: CommonTextFieldProps) => {
	const { placeholder, name, id, label, type, required, className } = props

	const { formInputClass, formInputIsErrorClass, formInputIsTouchedClass } =
		useFormClasses()

	// required, since label has for parameter
	const actualId = id ?? useMemo(() => generateUUID(), [])

	return (
		<Field<string> name={name}>
			{({ input, meta }) => (
				<div
					className={classnames(
						formInputClass,
						`${formInputClass}__text`,
						meta.touched ? formInputIsTouchedClass : null,
						meta.error ? formInputIsErrorClass : null,
						className,
					)}
				>
					<label htmlFor={actualId}>{label}</label>
					{type === "textarea" ? (
						<textarea
							{...input}
							placeholder={placeholder}
							id={actualId}
							required={required}
						></textarea>
					) : (
						<input
							{...input}
							placeholder={placeholder}
							type={type ?? "text"}
							id={actualId}
							required={required}
						/>
					)}
					{meta.error && <ValidationError error={meta.error} />}
				</div>
			)}
		</Field>
	)
}

export default TextField
