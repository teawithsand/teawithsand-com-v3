import PageContainer from "@app/components/layout/PageContainer"
import { tagPath } from "@app/paths"
import { graphql, Link } from "gatsby"
import React, { useMemo } from "react"
import styled from "styled-components"
import {
	breakpointMediaDown,
	BREAKPOINT_SM,
} from "tws-common/react/hook/dimensions/useBreakpoint"

const InnerContainer = styled.div`
	@media ${breakpointMediaDown(BREAKPOINT_SM)} {
		text-align: center;
	}
`

const Header = styled.h1`
	font-size: 2rem;
`

const TagList = styled.ul`
	font-size: 1.4rem;
`

const IndexPage = (props: { data: Queries.TagsPageQuery }) => {
	const tags = useMemo(() => {
		const res = [...(props.data?.allFile?.group || [])]
			?.sort((a, b) => a.tag?.localeCompare(b?.tag || "") || 0)
			?.map((v, i) =>
				v ? (
					<li
						key={i}
						title={`There are ${v.count} posts with ${v.tag}`}
					>
						<Link to={tagPath(v.tag)}>
							{v.tag} ({v.count})
						</Link>
					</li>
				) : null,
			)
			?.filter(v => !!v)

		return res
	}, [props.data])
	
	return (
		<main>
			<PageContainer>
				<InnerContainer>
					<header>
						<Header>Tags ({tags.length})</Header>
					</header>
					<TagList>{tags}</TagList>
				</InnerContainer>
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
