import arrayMutators from "final-form-arrays"
import React from "react"
import { Field as FinalField, Form as FinalForm } from "react-final-form"

import { useAppTranslationSelector } from "@app/trans/AppTranslation"

import { Button, Form } from "tws-common/ui"

export type LocationFormData = {
	name: string
	description: string
	latitude: number
	longitude: number
}

const step = 0.000000000000001

export const LocationForm = (props: {
	initialValues: LocationFormData
	onSubmit: (data: LocationFormData) => Promise<void>
}) => {
	const commonTrans = useAppTranslationSelector(s => s.common.form)
	const trans = useAppTranslationSelector(s => s.location.form)

	const { initialValues, onSubmit } = props

	return (
		<FinalForm<LocationFormData>
			onSubmit={async values => await onSubmit({ ...values })}
			mutators={{
				...arrayMutators,
			}}
			initialValues={initialValues}
			render={({ handleSubmit, submitting, pristine }) => (
				<Form onSubmit={handleSubmit}>
					<Form.Group className="mb-3">
						<Form.Label>{trans.nameLabel}</Form.Label>

						<FinalField name="name">
							{({ input }) => (
								<Form.Control type="text" {...input} />
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

					<Form.Group className="mb-3">
						<Form.Label>{trans.latitudeLabel}</Form.Label>

						<FinalField name="latitude">
							{({ input }) => (
								<Form.Control
									max={180}
									min={-180}
									step={step}
									type="number"
									{...input}
								/>
							)}
						</FinalField>
					</Form.Group>

					<Form.Group className="mb-3">
						<Form.Label>{trans.longitudeLabel}</Form.Label>

						<FinalField name="longitude">
							{({ input }) => (
								<Form.Control
									max={90}
									min={-90}
									step={step}
									type="number"
									{...input}
								/>
							)}
						</FinalField>
					</Form.Group>

					<Button
						className="mt-2"
						disabled={submitting || pristine}
						type="submit"
					>
						{commonTrans.submitLabel}
					</Button>
				</Form>
			)}
		/>
	)
}
