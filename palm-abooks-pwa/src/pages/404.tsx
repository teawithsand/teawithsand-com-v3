import * as React from "react"
import { Link } from "gatsby"

const NotFoundPage = () => {
	return (
		<div>
			Not found {":("}
			<Link to="/">Go home</Link>
		</div>
	)
}

export default NotFoundPage
