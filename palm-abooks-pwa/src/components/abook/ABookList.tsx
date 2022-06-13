import PageContainer from "@app/components/layout/PageContainer"
import { LoadedABookData } from "@app/domain/abook/ABookStore"
import React from "react"
import { Card, Col, Row } from "tws-common/ui"

const ABookList = (props: { abooks: LoadedABookData[] }) => {
	const { abooks } = props

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
								<Card.Title>{abook.metadata.title}</Card.Title>
								<Card.Text>
									{abook.metadata.description ||
										"No description"}
								</Card.Text>
							</Card.Body>
						</Card>
					</Col>
				</Row>
			))}
		</PageContainer>
	)
}

export default ABookList
