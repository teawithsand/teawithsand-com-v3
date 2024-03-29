import arrayMutators from "final-form-arrays"
import React, { useMemo } from "react"
import { Field as FinalField, Form as FinalForm } from "react-final-form"

import FilesFinalField from "@app/components/abook/form/FilesFinalField"

import { Button, Form } from "tws-common/ui"

export type CreateABookFormData = {
	title: string
	description: string
	files: File[]
}

const CreateABookForm = (props: {
	onSubmit: (data: CreateABookFormData) => Promise<void>
}) => {
	const initialValues: CreateABookFormData = useMemo(
		() => ({
			files: [],
			description: "",
			title: "",
		}),
		[],
	)
	return (
		<FinalForm<CreateABookFormData>
			onSubmit={values =>
				props.onSubmit({
					...values,
				})
			}
			mutators={{
				...arrayMutators,
			}}
			initialValues={initialValues}
			render={({ handleSubmit, submitting, pristine }) => (
				<Form onSubmit={handleSubmit}>
					<Form.Group className="mb-3">
						<Form.Label>ABook name</Form.Label>

						<FinalField name="title">
							{({ input }) => (
								<Form.Control type="text" {...input} />
							)}
						</FinalField>
					</Form.Group>

					<Form.Group className="mb-3">
						<Form.Label>ABook description</Form.Label>

						<FinalField name="description">
							{({ input }) => (
								<Form.Control as="textarea" {...input} />
							)}
						</FinalField>
					</Form.Group>
					<FilesFinalField name="files" />

					<Button
						className="mt-2"
						disabled={submitting || pristine}
						type="submit"
					>
						Submit
					</Button>
				</Form>
			)}
		/>
	)
}

export default CreateABookForm
