import React, { useMemo } from "react"
import { graphql } from "gatsby"

import Layout from "@app/components/layout/Layout"
import { GalleryItem } from "@app/components/gallery"
import Gallery from "@app/components/gallery/Gallery"
import { ArrayGalleryItemProvider } from "@app/components/gallery/ItemProvider"

const BlogIndex = () => {
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
			alt: "bog",
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

export default BlogIndex

export const pageQuery = graphql`
	query {
		site {
			siteMetadata {
				title
			}
		}
	}
`

/*
import * as React from "react"
import { Link, graphql } from "gatsby"

import Bio from "../components/bio"
import Layout from "../components/layout"
import Seo from "../components/seo"

const BlogIndex = ({ data, location }) => {
  const siteTitle = data.site.siteMetadata?.title || `Title`
  const posts = data.allMarkdownRemark.nodes

  if (posts.length === 0) {
    return (
      <Layout location={location} title={siteTitle}>
        <Seo title="All posts" />
        <Bio />
        <p>
          No blog posts found. Add markdown posts to "content/blog" (or the
          directory you specified for the "gatsby-source-filesystem" plugin in
          gatsby-config.js).
        </p>
      </Layout>
    )
  }

  return (
    <Layout location={location} title={siteTitle}>
      <Seo title="All posts" />
      <Bio />
      <ol style={{ listStyle: `none` }}>
        {posts.map(post => {
          const title = post.frontmatter.title || post.fields.slug

          return (
            <li key={post.fields.slug}>
              <article
                className="post-list-item"
                itemScope
                itemType="http://schema.org/Article"
              >
                <header>
                  <h2>
                    <Link to={post.fields.slug} itemProp="url">
                      <span itemProp="headline">{title}</span>
                    </Link>
                  </h2>
                  <small>{post.frontmatter.date}</small>
                </header>
                <section>
                  <p
                    dangerouslySetInnerHTML={{
                      __html: post.frontmatter.description || post.excerpt,
                    }}
                    itemProp="description"
                  />
                </section>
              </article>
            </li>
          )
        })}
      </ol>
    </Layout>
  )
}

export default BlogIndex

export const pageQuery = graphql`
  query {
    site {
      siteMetadata {
        title
      }
    }
    allMarkdownRemark(sort: { fields: [frontmatter___date], order: DESC }) {
      nodes {
        excerpt
        fields {
          slug
        }
        frontmatter {
          date(formatString: "MMMM DD, YYYY")
          title
          description
        }
      }
    }
  }
`

*/
