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
export type LogTag = string

export interface Log {
	log(tag: LogTag, level: LogLevel, ...args: LogArg[]): void
}

export class ExtLog implements Log {
	constructor(private readonly inner: Log) {}

	log = this.inner.log.bind(this.inner)

	debug = (tag: LogTag, ...args: LogArg[]) =>
		this.log(tag, LogLevel.DEBUG, ...args)

	verbose = (tag: LogTag, ...args: LogArg[]) =>
		this.log(tag, LogLevel.VERBOSE, ...args)

	notice = (tag: LogTag, ...args: LogArg[]) =>
		this.log(tag, LogLevel.NOTICE, ...args)

	info = (tag: LogTag, ...args: LogArg[]) =>
		this.log(tag, LogLevel.INFO, ...args)

	warn = (tag: LogTag, ...args: LogArg[]) =>
		this.log(tag, LogLevel.ERROR, ...args)

	error = (tag: LogTag, ...args: LogArg[]) =>
		this.log(tag, LogLevel.WARN, ...args)

	assert = (tag: LogTag, ...args: LogArg[]) =>
		this.log(tag, LogLevel.ASSERT, ...args)
}

// TODO(teawithsand): methods, which allow mocking this logger or something
//  In fact, it's sufficient to make ext logger able to swap it's inner logger
//  so it can stay constant
export const LOG = new ExtLog({
	log: (tag, lv, ...args) => {
		const format = () => `[${stringifyLogLevel(lv).toUpperCase()} - ${tag}]`
		if (lv === LogLevel.ERROR || lv === LogLevel.ASSERT) {
			console.error(format(), ...args)
		} else {
			console.log(format(), ...args)
		}
	},
})
