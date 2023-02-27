import React from "react"
import { Field as FinalField } from "react-final-form"
import { FieldArray } from "react-final-form-arrays"

import { abookFilesMimesAndExtensions } from "@app/util/fileTypes"

import { formatFileSize } from "tws-common/lang/fileSize"
import { Button, Form, Table } from "tws-common/ui"

const FilesFinalField = (props: { label?: string; name: string }) => {
	const { name, label } = props
	return (
		<>
			<Form.Group className="mb-3">
				<Form.Label>
					{label ??
						"ABook files(you can drag-and-drop them onto field)"}
				</Form.Label>

				{
					// Note: DnD area is not needed as much, since user can DnD files onto file field
				}
				<FinalField<File[]> name={name}>
					{({ input }) => {
						return (
							<Form.Control
								accept={abookFilesMimesAndExtensions.join(",")}
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
											a.name.localeCompare(b.name),
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
			<FieldArray<File> name={name}>
				{({ fields }) => {
					return (
						<>
							{
								// TODO(teawithsand): make entries in this table draggable
								//  so user can determine order of files as well.
								// This is critical for ABooks.
							}
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
											<td>{formatFileSize(f.size)}</td>
											<td>Music</td>
											<td>
												<Button
													variant="danger"
													onClick={() => {
														fields.remove(i)
													}}
												>
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
		</>
	)
}

export default FilesFinalField
