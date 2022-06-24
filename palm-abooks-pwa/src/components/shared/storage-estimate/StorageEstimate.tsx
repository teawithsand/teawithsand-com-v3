import { useEffect, useState } from "react"
import React from "react"

import { formatFileSize } from "tws-common/lang/fileSize"
import { estimateStorage } from "tws-common/webapi/storagemanager"

const StorageEstimate = () => {
	const [estimate, setEstimate] = useState<StorageEstimate | null>(null)
	useEffect(() => {
		let isClosed = false
		const c = async () => {
			const loadedEstimate = await estimateStorage()
			if (loadedEstimate) {
				if (!isClosed) setEstimate(loadedEstimate)
			}
		}

		c()
		return () => {
			isClosed = true
		}
	}, [])

	return estimate &&
		typeof estimate.usage !== "undefined" &&
		typeof estimate.quota !== "undefined" ? (
		<p>
			<strong>
				You used {formatFileSize(estimate.usage)} out of{" "}
				{formatFileSize(estimate.quota)}, which leaves{" "}
				{formatFileSize(estimate.quota - estimate.usage)} of free space.
			</strong>
		</p>
	) : null
}

export default StorageEstimate
