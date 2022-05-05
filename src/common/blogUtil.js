const blogPostPath = slug => {
	if (slug.startsWith("/")) {
		return "/blog/post" + slug
	} else {
		return "/blog/post/" + slug
	}
}

const blogPostFilter = `
sourceInstanceName: { eq: "blog" }
relativePath: { regex: "/\\\\.md$/" }
`.trim()

const blogPostPagesQueryString = `
	query {
        allFile(
            filter: {
                ${blogPostFilter}
            }
            sort: {
                fields: [childMarkdownRemark___frontmatter___date]
                order: ASC
            }
        ) {
            nodes {
                childMarkdownRemark {
                    id
                    fields {
                        slug
                    }
                }
            }
        }
    }
`

const blogPostFeedQueryString = `
query {
    allFile(
        filter: {
            ${blogPostFilter}
        }
        sort: {
            fields: [childMarkdownRemark___frontmatter___date]
            order: ASC
        }
    ) {
        nodes {
            childMarkdownRemark {
                excerpt
                html
                fields {
                    slug
                }
                frontmatter {
                    title
                    date
                }
            }
        }
    }
}
`

module.exports = {
	blogPostPath,
	blogPostPagesQueryString,
	blogPostFeedQueryString,
}
