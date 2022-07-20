import PageContainer from "@app/components/layout/PageContainer"
import PostsGrid from "@app/components/post/PostsGrid"
import { PostHeader } from "@app/domain/Post"
import { tagPath } from "@app/paths"
import { graphql, Link } from "gatsby"
import * as React from "react"
import styled from "styled-components"
import { Container } from "tws-common/ui"

const Header = styled.h1`
	font-size: 2rem;
`

const IndexPage = (props: { data: Queries.TagsPageQuery }) => {
	const tags = props.data?.allFile?.group
		?.map((v, i) =>
			v ? (
				<li key={i}>
					<Link to={tagPath(v.tag)}>
						{v.tag} ({v.count})
					</Link>
				</li>
			) : null,
		)
		?.filter(v => !!v)
	return (
		<main>
			<PageContainer>
				<header>
					<Header>Tags ({tags.length})</Header>
				</header>
				<ul>{tags}</ul>
			</PageContainer>
		</main>
	)
}

export default IndexPage

export const query = graphql`
	query TagsPage {
		allFile(
			filter: {
				sourceInstanceName: { eq: "blog" }
				name: { eq: "index" }
				extension: { eq: "md" }
			}
		) {
			group(field: childMarkdownRemark___frontmatter___tags) {
				tag: fieldValue
				count: totalCount
			}
		}
	}
`
