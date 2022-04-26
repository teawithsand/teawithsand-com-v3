const getFun = <T>(original: () => T): (() => T) => {
	let value: T
	let loaded = false
	return () => {
		if (!loaded) {
			value = original()
			loaded = true
		}
		return value
	}
}

export function Memoize() {
	return (target: Object, propertyKey: string, descriptor: TypedPropertyDescriptor<any>) => {
		if (descriptor.value != null) {
			descriptor.value = getFun(descriptor.value);
		} else if (descriptor.get != null) {
			descriptor.get = getFun(descriptor.get);
		} else {
			throw new Error("memorize on getter only");
		}
	};
}