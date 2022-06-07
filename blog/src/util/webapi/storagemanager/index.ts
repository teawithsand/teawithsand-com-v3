export const isStorageSupported = () => "storage" in navigator

export const estimateStorage = async () => {
	if (!isStorageSupported()) return null
	try {
		return await navigator.storage.estimate()
	} catch (e) {
		return null
	}
}

export const requestPersistentStorage = async () => {
	if (!isStorageSupported()) return false
	try {
		return await navigator.storage.persist()
	} catch (e) {
		return false
	}
}

export const isPersistentStorage = async () => {
	if (!isStorageSupported()) return false
	try {
		return await navigator.storage.persisted()
	} catch (e) {
		return false
	}
}
