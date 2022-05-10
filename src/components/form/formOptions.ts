export type FormProps<T> = {
	onChange?: (value: T) => void
	validate?: (value: T) => { [key: string]: string } | null
	validateAsync?: (value: T) => Promise<{ [key: string]: string } | null>
	onSubmit?: (value: T) => void
}
