import { navigate } from "gatsby"
import React from "react"
import styled from "styled-components"

import PageContainer from "@app/components/layout/PageContainer"
import { LoadedABookData } from "@app/domain/abook/typedef"
import { libraryABookIndex, libraryAddABookPath } from "@app/paths"

import { Button, Card, Col, Row } from "tws-common/ui"

const CenteredElementGrid = styled.div`
	display: grid;
	grid-auto-flow: row;
	gap: 1em;
	justify-items: center;
	grid-template-row: minmax(0, auto);
`

const ABookList = (props: { abooks: LoadedABookData[] }) => {
	const { abooks } = props

	if (abooks.length === 0) {
		return (
			<PageContainer>
				<CenteredElementGrid>
					<h1>No ABooks in library</h1>
					<Button
						size="lg"
						onClick={() => {
							navigate(libraryAddABookPath)
						}}
					>
						Add ABook from local storage
					</Button>
					<Button
						size="lg"
						onClick={() => {
							navigate(libraryABookIndex)
						}}
					>
						Go to ABook library management
					</Button>
				</CenteredElementGrid>
			</PageContainer>
		)
	} else {
		return (
			<PageContainer>
				<Row className="mb-3">
					<Col>
						<h1>Total {abooks.length} ABooks:</h1>
					</Col>
				</Row>
				{abooks.map(abook => (
					<Row key={abook.id} className="mt-2">
						<Col>
							<Card>
								<Card.Body>
									<Card.Title>
										{abook.metadata.title}
									</Card.Title>
									<Card.Text>
										{abook.metadata.description ||
											"No description"}
									</Card.Text>
								</Card.Body>
							</Card>
						</Col>
					</Row>
				))}
				<hr />
				<Row className="mt-5 text-center">
					<Col>
						<CenteredElementGrid>
							<h1>No ABook you were looking for?</h1>
							<Button
								size="lg"
								onClick={() => {
									navigate(libraryABookIndex)
								}}
							>
								Go to ABook library management
							</Button>
						</CenteredElementGrid>
					</Col>
				</Row>
			</PageContainer>
		)
	}
}

export default ABookList
