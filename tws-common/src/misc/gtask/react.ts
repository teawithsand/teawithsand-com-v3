import React, { useContext } from "react"
import { GTaskRunner } from "tws-common/misc/gtask/impl"

export const createGTaskRunnerContext = <M>(runner: GTaskRunner<M>) =>
	React.createContext(runner)

export const useGTaskRunnerContext = <M>(
	ctx: React.Context<GTaskRunner<M>>,
): GTaskRunner<M> => useContext(ctx)
