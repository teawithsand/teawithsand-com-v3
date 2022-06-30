import arrayMutators from "final-form-arrays"
import React from "react"
import { Field as FinalField, Form as FinalForm } from "react-final-form"
import { FieldArray } from "react-final-form-arrays"

import { abookFilesMimesAndExtensions } from "@app/util/fileTypes"

import { formatFileSize } from "tws-common/lang/fileSize"
import { Button, Form } from "tws-common/ui"

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
						<Form.Label>ABook files</Form.Label>

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

					<FieldArray name="files">
						{({ fields }) => {
							return (
								<ul>
									{fields.value.map((f, i) => (
										<li key={i}>
											<b>{f.name}</b>
											{" - "}
											{formatFileSize(f.size)}
										</li>
									))}
								</ul>
							)
						}}
					</FieldArray>

					{/*
					{({ fields}) => (
							<ul>
							{files.map((f, i) => (
								<li key={i}>
									<b>{f.name}</b>
									{" - "}
									{formatFileSize(f.size)}
								</li>
							))}
						</ul>
						{files.length > 0 ? (
							<h3>
								Total{" "}
								{formatFileSize(
									files.reduce((pv, v) => pv + v.size, 0),
								)}
							</h3>
						) : null}
						)}

						<FormSpy
						subscription={{
							modified: true,
							pristine: true,
							values: true,
						}}
					>
						{props => {
							const files = getFiles(props?.values?.files)
							return (
								<>
									<h3>Picked files ({files.length})</h3>
									<ul>
										{files.map((f, i) => (
											<li key={i}>
												<b>{f.name}</b>
												{" - "}
												{formatFileSize(f.size)}
											</li>
										))}
									</ul>
									{files.length > 0 ? (
										<h3>
											Total{" "}
											{formatFileSize(
												files.reduce(
													(pv, v) => pv + v.size,
													0,
												),
											)}
										</h3>
									) : null}
								</>
							)
						}}
					</FormSpy>
					*/}

					<Button disabled={submitting || pristine} type="submit">
						Submit
					</Button>
				</Form>
			)}
		/>
	)
}

export default CreateABookForm
