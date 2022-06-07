export const formatDate = (date: string): string => {
	const parsed = new Date(date)
	return parsed.toLocaleDateString("pl-PL")
}

export const formatTime = (date: string): string => {
	const parsed = new Date(date)
	return parsed.toLocaleString("pl-PL")
}
