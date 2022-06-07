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
