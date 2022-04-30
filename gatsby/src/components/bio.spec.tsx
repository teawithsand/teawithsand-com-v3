import * as React from 'react'
import { render } from "@testing-library/react"

const Title = () => <h1 data-testid="hero-title">Gatsby is awesome!</h1>

describe("Header", () => {
	it("renders correctly", () => {
		const rendered = render(<Title />)
		expect(rendered.getByTestId("hero-title")).toHaveTextContent("Gatsby")
	})
})
