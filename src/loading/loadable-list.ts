import { Atom } from "@grammarly/focal"
import { LoadingState } from "./domain"
import { load } from "."

export type LoadableListLoader<D, C> = (continuation: C | null) => Promise<[D[], C]>

export type LoadableListState<D, C> = {
	items: D[],
	loadingState: LoadingState<[D[], C | null]>,
	finished: boolean,
}

export const loadableListStateIdle = <D, C>(): LoadableListState<D, C> => ({
	items: [],
	loadingState: {
		status: {
			status: "idle",
		},
		value: [[], null],
	},
	finished: false,
})

export const createLoadableList = <D, C>(loader: LoadableListLoader<D, C>, source: Atom<LoadableListState<D, C>>) => {
	return async () => {
		const finishedLens = source.lens("finished")

		if (!finishedLens.get()) {
			const state = source.lens("loadingState")

			const [, continuation] = source.lens("loadingState").lens("value").get()
			const promise = loader(continuation)

			await load(promise, state)

			promise
				.then(([nextItems]) => {
					if (nextItems.length === 0) {
						finishedLens.set(true)
					}

					source.lens("items").modify((prev) => prev.concat(nextItems))
				})
				.catch(() => { /** No-op */ })


		} else {
			console.warn("Loadable list already finished")
		}
	}
}
