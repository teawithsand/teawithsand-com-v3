import React from "react"
import { Form as FinalForm, Field as FinalField } from "react-final-form"
import { Form, Button } from "tws-common/ui"

const onSubmit = async (data: any) => {
	console.log("Form data", { data })
}

const CreateABookForm = () => {
	return (
		<FinalForm
			onSubmit={onSubmit}
			render={({ handleSubmit, form, submitting, pristine, values }) => (
				<Form onSubmit={handleSubmit}>
					<Form.Group className="mb-3">
						<Form.Label>Email address</Form.Label>

						<FinalField name="abookName">
							{({ input }) => (
								<Form.Control type="text" {...input} />
							)}
						</FinalField>
						<Form.Text className="text-muted">
							We'll never share your email with anyone else.
						</Form.Text>
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
