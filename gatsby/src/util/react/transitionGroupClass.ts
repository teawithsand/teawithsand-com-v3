export type TransitionGroupClasses = {
	appear?: string
	appearActive?: string
	appearDone?: string
	enter?: string
	enterActive?: string
	enterDone?: string
	exit?: string
	exitActive?: string
	exitDone?: string
}

function sanitizeForFieldName(text: string) {
	return text.charAt(0).toLowerCase() + text.slice(1)
}

/**
 * Util, which filters object from css modules and packs styles from it to form, which is required
 * for CSSTransition to work.
 *
 * For now, works only with camelCase
 */
export const findTransitionClasses = (
	prefix: string,
	obj: {
		[key: string]: string
	}
): TransitionGroupClasses => {
	let res: any = {}
	for (const k in obj) {
		const v = obj[k]
		if (k.startsWith(prefix)) {
			res[sanitizeForFieldName(k.slice(prefix.length))] = v
		}
	}

	return res
}
