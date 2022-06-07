import React, { useEffect, useState } from "react"

import Layout from "@app/components/layout/Layout"

import KeyValueObjectFileStore from "tws-common/file/ofs/KeyValueObjectFileStore"
import LocalForageKeyValueStore from "tws-common/keyvalue/LocalForageKeyValueStore"
import { collectAsyncIterable } from "tws-common/lang/asyncIterator"

const testFileStore = new KeyValueObjectFileStore(
	LocalForageKeyValueStore.simple("testFileStore"),
)

const handleFiles = async (files: FileList | null) => {
	if (!files) return null
	const file = files[0]
	console.log({ file })
	if (file) {
		await testFileStore.store(file.name, file)
	}

	const res = await testFileStore.get(file.name)
	return res
}
const FileStorePage = () => {
	const [files, setFiles] = useState<FileList | null>(null)
	const [fileList, setFileList] = useState<string[]>([])

	useEffect(() => {
		;(async () => {
			const values = await collectAsyncIterable(
				testFileStore.iterateKeys(),
			)
			setFileList(values)
		})()
	})

	return (
		<Layout>
			<form
				onSubmit={e => {
					e.preventDefault()
					handleFiles(files)
					return false
				}}
			>
				<p>Pick file</p>
				<input
					type="file"
					accept=".mp3,audio/mpeg3,audio/mpeg"
					onChange={e => setFiles(e.target.files)}
				></input>

				<input type="submit" value="gogo" />

				<p>Entries:</p>
				<code>{JSON.stringify(fileList, null, 4)}</code>
			</form>
		</Layout>
	)
}

export default FileStorePage
