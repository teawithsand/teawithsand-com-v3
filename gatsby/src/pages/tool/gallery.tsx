import React, { useMemo } from "react"
import { graphql } from "gatsby"

import Layout from "@app/components/layout/Layout"
import { GalleryItem } from "@app/components/gallery"
import Gallery from "@app/components/gallery/Gallery"
import { ArrayGalleryItemProvider } from "@app/components/gallery/ItemProvider"

const GalleryPage = () => {
	const items: GalleryItem[] = [
		{
			type: "image",
			src: "https://upload.wikimedia.org/wikipedia/en/7/7d/Lenna_%28test_image%29.png",
			alt: "Lena image",
			key: "one",
		},
		{
			type: "image",
			src: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/02/Wikipe-tan_in_Different_Anime_Styles.png/1024px-Wikipe-tan_in_Different_Anime_Styles.png",
			alt: "Weeb stuff",
			key: "two",
		},
		{
			type: "image",
			src: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/38/Jan_Matejko%2C_Bitwa_pod_Grunwaldem.jpg/2560px-Jan_Matejko%2C_Bitwa_pod_Grunwaldem.jpg",
			alt: "Battle of Grunwald",
			key: "three",
		},
	]

	const provider = useMemo(() => new ArrayGalleryItemProvider(items), [items])

	return (
		<Layout>
			<Gallery provider={provider} />
		</Layout>
	)
}

export default GalleryPage

export const pageQuery = graphql`
	query {
		site {
			siteMetadata {
				title
			}
		}
	}
`
