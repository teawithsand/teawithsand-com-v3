import arrayMutators from "final-form-arrays"
import React from "react"
import { Field as FinalField, Form as FinalForm } from "react-final-form"

import { useAppTranslationSelector } from "@app/trans/AppTranslation"

import { Button, Form } from "tws-common/ui"

export type LocationFormData = {
	name: string
	description: string
}

type InnerFormData = {
	name: string
	description: string
}

export const SimplifiedLocationForm = (props: {
	disabled?: boolean
	initialValues?: LocationFormData
	onSubmit: (data: LocationFormData) => Promise<void>
}) => {
	const commonTrans = useAppTranslationSelector(s => s.common.form)
	const trans = useAppTranslationSelector(s => s.location.form)

	const { initialValues, onSubmit, disabled } = props

	return (
		<FinalForm<InnerFormData>
			onSubmit={async values => {
				if (disabled) return
				return await onSubmit({
					name: values.name,
					description: values.description,
				})
			}}
			mutators={{
				...arrayMutators,
			}}
			initialValues={
				initialValues
					? {
							name: initialValues.name,
							description: initialValues.description,
					  }
					: undefined
			}
			render={({ handleSubmit, submitting, pristine }) => (
				<Form onSubmit={handleSubmit}>
					<Form.Group className="mb-3">
						<Form.Label>{trans.nameLabel}</Form.Label>

						<FinalField
							name="name"
							validate={name => {
								if ((name || "").trim().length === 0) {
									return trans.validation.name.notEmpty
								}
							}}
						>
							{({ input, meta }) => (
								<>
									<Form.Control
										type="text"
										{...input}
										isInvalid={!!meta.error}
									/>
									{(meta.error ?? null) && (
										<Form.Control.Feedback type="invalid">
											{meta.error}
										</Form.Control.Feedback>
									)}
								</>
							)}
						</FinalField>
					</Form.Group>

					<Form.Group className="mb-3">
						<Form.Label>{trans.descriptionLabel}</Form.Label>

						<FinalField name="description">
							{({ input }) => (
								<Form.Control as="textarea" {...input} />
							)}
						</FinalField>
					</Form.Group>

					<Button
						className="mt-2"
						disabled={submitting || pristine || disabled}
						type="submit"
					>
						{commonTrans.submitLabel}
					</Button>
				</Form>
			)}
		/>
	)
}
