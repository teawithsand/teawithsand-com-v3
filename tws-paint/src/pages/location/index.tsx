import React from "react"
import styled from "styled-components"

import PageContainer from "@app/components/layout/PageContainer"
import {
	locationAddPath,
	locationListPath,
	locationLocatePath,
} from "@app/paths"
import { useAppTranslationSelector } from "@app/trans/AppTranslation"

import { Button } from "tws-common/ui"
import LinkContainer from "tws-common/ui/LinkContainer"

const OptionsContainer = styled.section`
	display: grid;
	grid-auto-flow: row;
	grid-template-columns: 1fr;
	grid-auto-rows: auto;
	text-align: center;
	gap: 1rem;
`

const FeatureDescription = styled.p`
	text-align: left;
`

const LocationMenuPage = () => {
	const trans = useAppTranslationSelector(s => s.location.menu)
	return (
		<PageContainer>
			<main>
				<OptionsContainer>
					<h1>{trans.title}</h1>
					<LinkContainer to={locationLocatePath}>
						<Button href="#">{trans.locateMe}</Button>
					</LinkContainer>
					<LinkContainer to={locationListPath}>
						<Button href="#">{trans.showLocations}</Button>
					</LinkContainer>
					<LinkContainer to={locationAddPath}>
						<Button href="#">{trans.addLocation}</Button>
					</LinkContainer>
					<FeatureDescription>
						{trans.featureDescription}
					</FeatureDescription>
				</OptionsContainer>
			</main>
		</PageContainer>
	)
}

export default LocationMenuPage
