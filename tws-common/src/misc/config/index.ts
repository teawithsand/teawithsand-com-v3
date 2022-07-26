import { createContext, useContext } from "react"

export interface Config {
	domainWithProtocol: string // ex. https://example.com
}
export type ConfigContext<T extends Config> = React.Context<T>

export const createConfigContext = <T extends Config>(value: T) =>
	createContext(value)

export const makeConfigHooks = <T extends Config>(ctx: ConfigContext<T>) => ({
	useConfig: () => useConfig(ctx),
	useConfigSelector: <E>(s: (config: T) => E) => s(useConfig(ctx)),
})

export const useConfig = <T extends Config>(ctx: ConfigContext<T>): T =>
	useContext(ctx)

export const useConfigSelector = <T extends Config, E>(
	ctx: ConfigContext<T>,
	s: (config: T) => E,
): E => s(useConfig(ctx))
