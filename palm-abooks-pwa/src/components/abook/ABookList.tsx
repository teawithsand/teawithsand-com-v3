import React from "react"
import ABook from "@app/domain/abook/ABook"
import { Card, Col, Row } from "tws-common/ui"
import { useAbookFileStore } from "@app/domain/abook/ABookFileStore"

const ABookList = (props: { abooks: ABook[] }) => {
	const { abooks } = props

	const abookFileStore = useAbookFileStore()

	return (
		<div>
			<Row>
				<Col>
					<h2>Total {abooks.length} ABooks:</h2>
				</Col>
			</Row>
			{abooks.map(abook => (
				<Row key={abook.id}>
					<Col>
						<Card>
							<Card.Body>
								<Card.Title>{abook.title}</Card.Title>
								<Card.Text>
									{abook.description || "No description"}
								</Card.Text>
							</Card.Body>
						</Card>
					</Col>
				</Row>
			))}
		</div>
	)
}

export default ABookList
