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

type InnerFormData = {
	name: string
	description: string
	latitude: string
	longitude: string
}

const step = 0.000000000000001

export const LocationForm = (props: {
	initialValues?: LocationFormData
	onSubmit: (data: LocationFormData) => Promise<void>
}) => {
	const commonTrans = useAppTranslationSelector(s => s.common.form)
	const trans = useAppTranslationSelector(s => s.location.form)

	const { initialValues, onSubmit } = props

	return (
		<FinalForm<InnerFormData>
			onSubmit={async values =>
				await onSubmit({
					name: values.name,
					description: values.description,
					latitude: parseFloat(values.latitude),
					longitude: parseFloat(values.longitude),
				})
			}
			mutators={{
				...arrayMutators,
			}}
			initialValues={
				initialValues
					? {
							name: initialValues.name,
							description: initialValues.description,
							latitude: initialValues.latitude.toString(),
							longitude: initialValues.longitude.toString(),
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

					<Form.Group className="mb-3">
						<Form.Label>{trans.latitudeLabel}</Form.Label>

						<FinalField
							name="latitude"
							validate={latitude => {
								if (latitude === undefined || latitude === "") {
									return trans.validation.latitude.notEmpty
								}
								const v = parseFloat(latitude)
								if (
									v > 90 ||
									v < -90 ||
									isNaN(v) ||
									!isFinite(v)
								) {
									return trans.validation.latitude.invalid
								}
							}}
						>
							{({ input, meta }) => (
								<>
									<Form.Control
										max={90}
										min={-90}
										step={step}
										type="number"
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
						<Form.Label>{trans.longitudeLabel}</Form.Label>

						<FinalField
							name="longitude"
							validate={longitude => {
								if (
									longitude === undefined ||
									longitude === ""
								) {
									return trans.validation.longitude.notEmpty
								}
								const v = parseFloat(longitude)
								if (
									v > 180 ||
									v < -180 ||
									isNaN(v) ||
									!isFinite(v)
								) {
									return trans.validation.longitude.invalid
								}
							}}
						>
							{({ input, meta }) => (
								<>
									<Form.Control
										max={180}
										min={-180}
										step={step}
										type="number"
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
