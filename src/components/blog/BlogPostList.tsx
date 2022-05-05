import classnames from "@app/util/lang/classnames"
import { graphql, Link, useStaticQuery } from "gatsby"
import React from "react"

import * as styles from "./blogPostList.module.scss"

export default () => {
	const data = useStaticQuery(graphql`
		query {
        allFile(
            filter: {
                sourceInstanceName: { eq: "blog" }
                relativePath: { regex: "/\\.md/" }
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
                    frontmatter{
                        title
                        date(formatString: "YYYY-MM-DD")
                    }
                    excerpt(pruneLength: 160)
                }
            }
        }
    }
	`)

	const entries = data.allFile.nodes
		.map((n: any) => n.childMarkdownRemark)
		.filter((e: any) => !!e)
	return (
		<main className={styles.postListContainer}>
			<header className={styles.postListHeader}>
				<h1>Blog post list</h1>
				<p>
					For now it's short, so no search aside from ctrl+f is needed
				</p>
				<hr />
			</header>
			<section>
				<ul className={styles.postList}>
					{entries.map((e: any, i: number) => (
						<li
							key={e.id}
							className={classnames(
								styles.postEntry,
								styles.postListEntry
							)}
						>
							{i !== 0 ? <hr /> : null}
							<Link to={"/blog/post" + e.fields.slug}>
								<h3>{e.frontmatter.title}</h3>
							</Link>
							<h6>Created at {e.frontmatter.date}</h6>
							<p className={styles.postEntryExcerpt}>
								{e.excerpt}
							</p>
							<Link
								to={"/blog/post" + e.fields.slug}
								className={styles.postEntrySeePost}
							>
								See post
							</Link>
						</li>
					))}
				</ul>
			</section>
			<hr />
			<footer>Total {entries.length} posts</footer>
		</main>
	)
}
