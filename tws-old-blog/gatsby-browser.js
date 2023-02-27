// custom typefaces
import "bootstrap/scss/bootstrap.scss"
import "normalize.css/normalize.css"
import "prismjs/plugins/line-numbers/prism-line-numbers.css"
// Highlighting for code blocks
import "prismjs/themes/prism.css"
import "typeface-merriweather"
import "typeface-montserrat"

import "./src/styles/global.scss"

// TODO(teawithsand): configure gatsby-plugin-offline here with custom code in service worker

export const onServiceWorkerUpdateReady = () => {
	const answer = window.confirm(
		`This application has been updated. ` +
			`Reload to display the latest version?`,
	)

	if (answer === true) {
		window.location.reload()
	}
}

export const registerServiceWorker = () => true
