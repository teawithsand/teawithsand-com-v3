import arrayMutators from "final-form-arrays"
import React, { useMemo } from "react"
import { Field as FinalField, Form as FinalForm } from "react-final-form"

import FilesFinalField from "@app/components/abook/form/FilesFinalField"

import { Button, Form } from "tws-common/ui"

export type CreateABookFormData = {
	files: File[]
}

const AddFilesABookForm = (props: {
	onSubmit: (data: CreateABookFormData) => Promise<void>
}) => {
	const initialValues: CreateABookFormData = useMemo(
		() => ({
			files: [],
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

export default AddFilesABookForm
