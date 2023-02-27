export const supported = () => {
	return "serviceWorker" in navigator
}

export const register = async (path: string) => {
	const registration = await navigator.serviceWorker.register(path)
	return {
		unregister: async () => await registration.unregister(),
	}
}
