import { graphql, useStaticQuery } from "gatsby"
import { getSrc } from "gatsby-plugin-image"
import { boundingExtent } from "ol/extent"
import React, { useMemo } from "react"
import styled from "styled-components"

import Map, { fromLonLat, MapIcon } from "@app/components/map/Map"
import { useAppTranslationSelector } from "@app/trans/AppTranslation"

import { useNavigate } from "tws-common/react/hook/useNavigate"
import { asRequiredRecursively } from "tws-common/typing/required"

const InnerContainer = styled.section`
	display: grid;
	grid-auto-flow: row;
	grid-auto-rows: auto;
	gap: 1rem;
`

const Header = styled.header`
	text-align: center;
`

export const ShrinesMapPage = () => {
	const navigate = useNavigate()
	const data: Queries.ShrineMapPageQuery = useStaticQuery(graphql`
		query ShrineMapPage {
			allFile(
				filter: {
					sourceInstanceName: { eq: "waysideshrines" }
					name: { eq: "index" }
					extension: { eq: "md" }
				}
			) {
				nodes {
					childMarkdownRemark {
						frontmatter {
							coordinates
							title
						}
						fields {
							path
						}
					}
				}
			}

			shrineIcon: allFile(
				filter: {
					sourceInstanceName: { eq: "images" }
					name: { eq: "location" }
				}
			) {
				nodes {
					childImageSharp {
						gatsbyImageData(
							layout: FIXED
							backgroundColor: "transparent"
							formats: [PNG]
							placeholder: TRACED_SVG
							height: 48
						)
					}
				}
			}
		}
	`)

	const iconSource = data.shrineIcon.nodes[0].childImageSharp?.gatsbyImageData
		? getSrc(data.shrineIcon.nodes[0].childImageSharp?.gatsbyImageData) ??
		  ""
		: ""

	const entries = useMemo(
		() =>
			data.allFile.nodes
				.map(v => asRequiredRecursively(v))
				.map(v => ({
					title: v.childMarkdownRemark.frontmatter.title,
					data: v.childMarkdownRemark.fields.path,
					coordinates: v.childMarkdownRemark.frontmatter
						.coordinates as [number, number],
					path: v.childMarkdownRemark.fields.path,
					processedCoordinates: fromLonLat(
						v.childMarkdownRemark.frontmatter.coordinates as [
							number,
							number,
						],
					),
				})),
		[data],
	)

	const extent = useMemo(
		() => boundingExtent(entries.map(v => v.processedCoordinates)),
		[entries],
	)

	const shrineIcon: MapIcon = useMemo(
		() => ({
			display: {
				anchor: [0.5, 46],
				anchorXUnits: "fraction",
				anchorYUnits: "pixels",
				src: iconSource,
			},
			locations: entries.map(v => ({
				coordinates: v.processedCoordinates,
				name: v.title,
				onClick: () => {
					navigate(v.path)
				},
			})),
		}),
		[entries],
	)

	const icons = useMemo(() => [shrineIcon], [shrineIcon])

	const trans = useAppTranslationSelector(s => s.map)

	return (
		<InnerContainer>
			<Header>
				<h1>{trans.title}</h1>
				<p>{trans.description}</p>
			</Header>

			<Map
				initialView={{
					type: "extent",
					extent: extent,
				}}
				icons={icons}
			/>
		</InnerContainer>
	)
}
