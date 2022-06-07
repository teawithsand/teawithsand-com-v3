import React, { useEffect, useMemo, useState } from "react"

import Layout from "@app/components/layout/Layout"
import { formatFileSize } from "tws-common/lang/fileSize"
import {
	estimateStorage,
	isStorageSupported,
	requestPersistentStorage,
} from "tws-common/webapi/storagemanager"

// const Gallery = loadable(() => import("@app/components/gallery/Gallery"))

const PlayerPage = () => {
	const supported = useMemo(() => isStorageSupported(), [])

	const [data, setData] = useState<StorageEstimate | null>(null)

	useEffect(() => {
		;(async () => {
			console.log("res", await requestPersistentStorage())
		})()
	}, [])

	useEffect(() => {
		estimateStorage().then(res => setData(res))

		const timeout = setInterval(() => {
			estimateStorage().then(res => setData(res))
		}, 5000)

		return () => {
			clearInterval(timeout)
		}
	}, [])

	if (!supported) {
		return (
			<Layout>
				<h3>Storage api not supported</h3>
			</Layout>
		)
	}

	if (!data) {
		return (
			<Layout>
				<h3>Loading storage information...</h3>
			</Layout>
		)
	}

	return (
		<Layout>
			<h3>
				{`Used ${formatFileSize(
					data.usage ?? 0,
				)} out of ${formatFileSize(data.quota ?? 0)}`}
			</h3>
		</Layout>
	)
}

export default PlayerPage
