export const homePath = "/"
export const listPath = "/list"
export const mapPath = "/map"
export const publishingPath = "/publishing"
export const locationMenuPath = "/location"
export const locationListPath = "/location/list"
export const locationLocatePath = "/location/locate"
export const locationAddPath = "/location/add"
export const tagPath = (tag: string) => `/tag/${tag}`
export const locationShowPath = (id: string) =>
	`/location/show?id=${encodeURIComponent(id)}`

export const locationEditPath = (id: string) =>
	`/location/edit?id=${encodeURIComponent(id)}`
