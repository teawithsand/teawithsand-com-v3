export default interface Lock {
	lock(): Promise<() => void>
}
