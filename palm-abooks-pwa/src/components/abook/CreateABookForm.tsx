import React from "react"
import { Form as FinalForm, Field as FinalField } from "react-final-form"
import { Form, Button } from "tws-common/ui"

export type CreateABookFormData = {
	name: string
	description: string
	files: File[]
}

const CreateABookForm = (props: {
	onSubmit: (data: CreateABookFormData) => Promise<void>
}) => {
	return (
		<FinalForm<CreateABookFormData>
			onSubmit={props.onSubmit}
			render={({ handleSubmit, submitting, pristine }) => (
				<Form onSubmit={handleSubmit}>
					<Form.Group className="mb-3">
						<Form.Label>ABook name</Form.Label>

						<FinalField name="name">
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
					<Form.Group className="mb-3">
						<Form.Label>ABook files</Form.Label>

						<FinalField name="files">
							{({ input }) => (
								<Form.Control type="file" multiple {...input} />
							)}
						</FinalField>
					</Form.Group>

					<Button disabled={submitting || pristine} type="submit">
						Submit
					</Button>
				</Form>
			)}
		/>
	)
}

export default CreateABookForm
