import React, { useMemo } from "react"
import { Field } from "react-final-form"

import { FormFieldProps } from "@app/components/form/fieldOptions"
import { useFormClasses } from "@app/components/form/util/FormContext"
import ValidationError from "@app/components/form/util/ValidationError"
import classnames from "@app/util/lang/classnames"
import { generateUUID } from "@app/util/lang/uuid"

export type CommonTextFieldProps = {
	placeholder?: string
	required?: boolean
	className?: string
	step?: number
	min?: number
	max?: number
} & FormFieldProps

const TextField = (props: CommonTextFieldProps) => {
	const {
		placeholder,
		name,
		id,
		label,
		required,
		className,
		min,
		max,
		step,
	} = props

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
						`${formInputClass}__number`,
						meta.touched ? formInputIsTouchedClass : null,
						meta.error ? formInputIsErrorClass : null,
						className,
					)}
				>
					<label htmlFor={actualId}>{label}</label>
					<input
						{...input}
						placeholder={placeholder}
						type="number"
						id={actualId}
						required={required}
						min={min}
						max={max}
						step={step}
					/>
					{meta.error && <ValidationError error={meta.error} />}
				</div>
			)}
		</Field>
	)
}

export default TextField
