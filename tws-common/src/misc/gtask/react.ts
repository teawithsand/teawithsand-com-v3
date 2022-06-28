import React, { useContext } from "react"
import { GTaskRunner } from "tws-common/misc/gtask/impl"

export const createGTaskRunnerContext = <T extends GTaskRunner<M>, M>(
	runner: T,
): React.Context<T> => React.createContext(runner)

export const useGTaskRunnerContext = <T extends GTaskRunner<M>, M>(
	ctx: React.Context<T>,
): T => useContext(ctx)
