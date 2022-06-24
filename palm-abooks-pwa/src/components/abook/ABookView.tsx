import React from "react"

import LoadingSpinner from "@app/components/shared/loading-spinner/LoadingSpinner"
import { ABookActiveRecord } from "@app/domain/abook/ABookStore"

import { LOG } from "tws-common/log/logger"
import { claimId, NS_LOG_TAG } from "tws-common/misc/GlobalIDManager"
import { useQuery } from "tws-common/react/hook/query"

const LOG_TAG = claimId(NS_LOG_TAG, "palm-abooks-pwa/abook-view")

const ABookView = (props: { abook: ABookActiveRecord }) => {
	const { abook } = props
	const {
		data: { metadata, id },
	} = abook

	const {
		error,
		data: abookFiles,
		status,
	} = useQuery(`abook/view/files/${id}`, async ({ signal }) => {
		try {
			const isAborted = () => signal?.aborted ?? false
			const files = []
			for await (const k of abook.files.keys()) {
				if (isAborted()) break
				const m = abook.files.getMetadata(k)
				if (!m) continue // shouldn't happen unless race condition

				files.push(m)
			}

			return files
		} catch (e) {
			LOG.error(LOG_TAG, "Error while loading ABook files", e)
			throw e
		}
	})

	let files = null
	if (status === "loading" || status === "idle") {
		files = <LoadingSpinner />
	} else if (status === "error") {
		files = <div>{JSON.stringify(error)}</div>
	} else if (status === "success") {
		// TODO(teawithsand): implement files panel + operations for each file like force metadata load
		//  reading MIME/manually setting disposition/delete and other stuff
		files = <h3>It has: {abookFiles.length} files</h3>
	}

	return (
		<div>
			<h1>ABook details</h1>
			<h2>Title: {metadata.title}</h2>
			<p>{metadata.description || "No description"}</p>
			<hr />

			{files}
		</div>
	)
}

export default ABookView
