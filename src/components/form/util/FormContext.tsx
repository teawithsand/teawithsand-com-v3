import { createContext, useContext } from "react"

export type FormContextData = {
	classNamePrefix: string
}

const Context = createContext<FormContextData>({
	classNamePrefix: "form", //
})

export const useFormClasses = () => {
	const { classNamePrefix } = useContext(Context)

	const formInputClass = `${classNamePrefix}__input`

	return {
		formInputClass,
		formInputIsTouchedClass: `${formInputClass}--touched`,
		formInputIsErrorClass: `${formInputClass}--error`,

		formInputValidationErrorClass: `${formInputClass}__validation-error`,
	}
}

export default Context
