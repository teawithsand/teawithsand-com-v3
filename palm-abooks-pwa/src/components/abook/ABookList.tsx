import { navigate } from "gatsby"
import React from "react"
import styled from "styled-components"

import PageContainer from "@app/components/layout/PageContainer"
import { LoadedABookData } from "@app/domain/abook/typedef"
import {
	abookLibraryIndexPath,
	abookLibraryViewPath,
	abookLibraryAddFromLocalFSPath,
} from "@app/paths"

import { Button, Card, Col, Row } from "tws-common/ui"
import LinkContainer from "tws-common/ui/LinkContainer"

const NoAbooksGrid = styled.div`
	display: grid;
	grid-auto-flow: row;
	gap: 1em;
	justify-items: center;
	grid-template-row: minmax(0, auto);
`

const ABookEntriesGrid = styled.div`
	display: grid;
	grid-auto-flow: row;
	gap: 1em;
`

const ABookCardGrid = styled.div`
	display: grid;
	grid-auto-flow: row;
`

const ABookList = (props: { abooks: LoadedABookData[] }) => {
	const { abooks } = props

	if (abooks.length === 0) {
		return (
			<PageContainer>
				<NoAbooksGrid>
					<h1>No ABooks in library</h1>
					<Button
						size="lg"
						onClick={() => {
							navigate(abookLibraryAddFromLocalFSPath)
						}}
					>
						Add ABook from local storage
					</Button>
					<Button
						size="lg"
						onClick={() => {
							navigate(abookLibraryIndexPath)
						}}
					>
						Go to ABook library management
					</Button>
				</NoAbooksGrid>
			</PageContainer>
		)
	} else {
		return (
			<PageContainer>
				<ABookEntriesGrid>
					<h1>Total {abooks.length} ABooks:</h1>
					{abooks.map(abook => (
						<Card key={abook.id}>
							<Card.Body>
								<Card.Title>
									Title:{" "}
									{abook.metadata.title ||
										`ABook with no title #${abook.id}`}
								</Card.Title>
								<ABookCardGrid>
									<p>
										{abook.metadata.description ||
											"No description"}
									</p>
									<p>
										<LinkContainer
											to={abookLibraryViewPath(abook.id)}
										>
											<Button href="#">Show ABook</Button>
										</LinkContainer>
									</p>
								</ABookCardGrid>
							</Card.Body>
						</Card>
					))}
				</ABookEntriesGrid>
				<hr />
				<Row className="mt-5 text-center">
					<Col>
						<NoAbooksGrid>
							<h1>No ABook you were looking for?</h1>
							<Button
								size="lg"
								onClick={() => {
									navigate(abookLibraryIndexPath)
								}}
							>
								Go to ABook library management
							</Button>
						</NoAbooksGrid>
					</Col>
				</Row>
			</PageContainer>
		)
	}
}

export default ABookList
