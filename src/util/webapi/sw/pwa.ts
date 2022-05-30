export const isRunningAsPWA = async () =>
	window.matchMedia("(display-mode: standalone)").matches
