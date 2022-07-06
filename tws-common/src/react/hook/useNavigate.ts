import { navigate } from "gatsby"

export type NavigateFunction = (urlOrPath: string) => void

/**
 * Hook, which returns navigate function.
 * It's needed, since different frameworks like gatsby and react-router-dom require different navigation functions.
 *
 * This code provides abstraction layer between these.
 */
export const useNavigate = (): NavigateFunction => {
	// TODO(teawithsand): make it really provide some abstraction layer
	//  right now it's hardcoded gatsby support.
	return navigate
}
