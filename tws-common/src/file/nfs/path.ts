export const isEntryNameValid = (name: string) => {
	if (name === "" || name === "." || name === ".." || name.includes("/"))
		return false
	return true
}
