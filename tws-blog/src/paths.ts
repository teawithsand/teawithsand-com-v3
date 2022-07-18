export const homePath = "/"
export const blogPostsPath = "/posts"
export const tagsPath = "/tags"
export const appsPath = "/apps"
export const tagPath = (tag: string) =>
	`/tag/${tag.replace(/[^\x00-\x7F]/g, "").toLowerCase()}`
