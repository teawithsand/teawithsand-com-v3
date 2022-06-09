import React from "react"
import { Form, Field } from "react-final-form"

const onSubmit = async (data: any) => {
	console.log("Form data", { data })
}

const CreateABookForm = () => {
	return (
		<Form
			onSubmit={onSubmit}
			render={({ handleSubmit, form, submitting, pristine, values }) => (
				<form onSubmit={handleSubmit}>
					<Field name="fieldOne" component="input" />
					<button>Submit</button>
				</form>
			)}
		/>
	)
}

export default CreateABookForm
