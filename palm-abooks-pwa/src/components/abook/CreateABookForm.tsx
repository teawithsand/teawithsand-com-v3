import arrayMutators from "final-form-arrays"
import React from "react"
import { Field as FinalField, Form as FinalForm } from "react-final-form"
import { FieldArray } from "react-final-form-arrays"

import { abookFilesMimesAndExtensions } from "@app/util/fileTypes"

import { formatFileSize } from "tws-common/lang/fileSize"
import { Button, Form, Table } from "tws-common/ui"

export type CreateABookFormData = {
	title: string
	description: string
	files: File[]
}

const CreateABookForm = (props: {
	onSubmit: (data: CreateABookFormData) => Promise<void>
}) => {
	return (
		<FinalForm<Partial<CreateABookFormData>>
			onSubmit={values =>
				props.onSubmit({
					files: [],
					title: "",
					description: "",
					...values,
				})
			}
			mutators={{
				...arrayMutators,
			}}
			initialValues={{
				files: [],
				description: "",
				title: "",
			}}
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
					<Form.Group className="mb-3">
						<Form.Label>
							ABook files(you can drag-and-drop them onto field)
						</Form.Label>

						{/* TODO(teawithsand): add drag and drop field/area */}
						<FinalField<File[]> name="files">
							{({ input }) => {
								return (
									<Form.Control
										accept={abookFilesMimesAndExtensions.join(
											",",
										)}
										type="file"
										{...{
											...input,

											value: undefined,

											// instead of the default target.value
											onChange: (e: any) => {
												// TODO(teawithsand): check if it works on older browsers, works on state-of-art ff
												const files = [
													...(e.target.files || []),
												]
												files.sort((a, b) =>
													a.name.localeCompare(
														b.name,
													),
												)
												return input.onChange(files)
											},
										}}
										multiple
									/>
								)
							}}
						</FinalField>
					</Form.Group>

					<FieldArray<File> name="files">
						{({ fields }) => {
							return (
								<>
									<Table hover striped bordered>
										<thead>
											<tr>
												<td>No.</td>
												<td>Name</td>
												<td>Size</td>
												<td>Role</td>
												<td>Operations</td>
											</tr>
										</thead>
										<tbody>
											{fields.value.map((f, i) => (
												<tr key={i}>
													<td>{i + 1}</td>
													<td>{f.name}</td>
													<td>
														{formatFileSize(f.size)}
													</td>
													<td>Music</td>
													<td>
														<Button variant="danger">
															Remove file
														</Button>
													</td>
												</tr>
											))}
										</tbody>
									</Table>
									<h3>
										Total{" "}
										{formatFileSize(
											fields.value
												.map(v => v.size)
												.reduce((pv, cv) => pv + cv, 0),
										)}
									</h3>
								</>
							)
						}}
					</FieldArray>

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
