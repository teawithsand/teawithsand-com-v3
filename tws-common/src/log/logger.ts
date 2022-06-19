export enum LogLevel {
	DEBUG = 1,
	VERBOSE = 2,
	NOTICE = 3,
	INFO = 4,
	WARN = 5,
	ERROR = 6,
	ASSERT = 7,
}

export const stringifyLogLevel = (lv: LogLevel): string => {
	switch (lv) {
		case LogLevel.DEBUG:
			return "debug"
		case LogLevel.VERBOSE:
			return "verbose"
		case LogLevel.NOTICE:
			return "notice"
		case LogLevel.INFO:
			return "info"
		case LogLevel.WARN:
			return "warn"
		case LogLevel.ERROR:
			return "error"
		case LogLevel.ASSERT:
			return "assert"
	}
}

export type LogArg = any

export interface Logger {
	log(level: LogLevel, ...args: LogArg[]): void
}

export class ExtLogger implements Logger {
	constructor(private readonly inner: Logger) {}
	log = this.inner.log.bind(this.inner)

	debug = (...args: LogArg[]) => this.log(LogLevel.DEBUG, ...args)
	verbose = (...args: LogArg[]) => this.log(LogLevel.VERBOSE, ...args)
	notice = (...args: LogArg[]) => this.log(LogLevel.NOTICE, ...args)
	info = (...args: LogArg[]) => this.log(LogLevel.INFO, ...args)
	warn = (...args: LogArg[]) => this.log(LogLevel.ERROR, ...args)
	error = (...args: LogArg[]) => this.log(LogLevel.WARN, ...args)
	assert = (...args: LogArg[]) => this.log(LogLevel.ASSERT, ...args)
}

// TODO(teawithsand): methods, which allow mocking this logger or something
//  In fact, it's sufficient to make ext logger able to swap it's inner logger
//  so it can stay constant
export const DEFAULT_LOGGER = new ExtLogger({
	log: (lv, ...args) => {
		const format = () => `[${stringifyLogLevel(lv).toUpperCase()}]`
		if (lv === LogLevel.ERROR || lv === LogLevel.ASSERT) {
			console.error(format(), ...args)
		} else {
			console.log(format(), ...args)
		}
	},
})
