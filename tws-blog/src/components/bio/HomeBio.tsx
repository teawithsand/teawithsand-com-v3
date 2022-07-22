import { graphql, Link, useStaticQuery } from "gatsby"
import React from "react"
import styled from "styled-components"
import { getImage, GatsbyImage } from "gatsby-plugin-image"
import { throwExpression } from "tws-common/lang/throw"
import {
	breakpointMediaDown,
	BREAKPOINT_MD,
} from "tws-common/react/hook/dimensions/useBreakpoint"
import { appsPath } from "@app/paths"

const MeImage = styled(GatsbyImage)`
	height: 150px;
	width: 150px;
	border-radius: 150px;
`

const BioContainer = styled.div`
	display: grid;
	grid-auto-columns: min-content auto;
	grid-template-rows: auto;
	grid-auto-flow: column;

	@media ${breakpointMediaDown(BREAKPOINT_MD)} {
		grid-auto-columns: auto;
		grid-template-rows: auto auto;
		grid-auto-flow: row;
	}

	gap: 1rem;

	// border: 1px solid rgba(0, 0, 0, 0.125);
	// border-radius: .25rem;
	padding: 0.3rem 0;
`

const Description = styled.div`
	font-size: 1.2rem;
`

const Heading = styled.h1`
	font-size: 1.4rem;
	font-weight: bold;
`

const HomeBio = () => {
	const meImage: Queries.BioMeImageQuery = useStaticQuery(graphql`
		query BioMeImage {
			allFile(
				filter: {
					sourceInstanceName: { eq: "images" }
					name: { eq: "me" }
				}
			) {
				edges {
					node {
						childImageSharp {
							gatsbyImageData(
								layout: CONSTRAINED
								width: 150
								placeholder: BLURRED
							)
						}
					}
				}
			}
		}
	`)

	const image =
		getImage(
			meImage.allFile.edges[0].node.childImageSharp?.gatsbyImageData ??
				throwExpression(new Error("Me image must be found")),
		) ?? throwExpression(new Error("Me image must be found"))

	return (
		<BioContainer>
			<MeImage
				image={image}
				objectFit="contain"
				alt="Photo of me - the author of this blog"
			/>
			<Description>
				<Heading>
					Hi, My name is Przemysław Głowacki(AKA teawithsand)!
				</Heading>
				<p>
					I am software developer, who mostly writes TypeScript with
					React JSX, but also some rust and go.
				</p>
				<p>
					Currently I am developing{" "}
					<Link to="https://palmabooks.com">PalmABooks PWA</Link> and{" "}
					<Link to="https://szlakiemkapliczek.pl">
						szlakiemkapliczek.pl
					</Link>{" "}
					I also maintain a few open source projects on my{" "}
					<Link to={"https://github.com/teawithsand"}>GitHub</Link>{" "}
					and <Link to={appsPath}>util websites</Link>.
				</p>
				<p>
					This website is my personal blog website, which is mostly
					about programming, but ultimately anything could be
					published here.
				</p>
			</Description>
		</BioContainer>
	)
}

export default HomeBio
