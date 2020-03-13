import { Atom } from "@grammarly/focal"
import { loadingStatusIdle, LoadingState } from "@roborox/rxjs-react/build/to-rx"
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
		status: loadingStatusIdle,
		value: [[], null],
	},
	finished: false,
})

export const createLoadableList = <D, C>(loader: LoadableListLoader<D, C>, source: Atom<LoadableListState<D, C>>) => {
	return async () => {
		const finished = source.lens("finished").get()

		if (!finished) {
			const [, continuation] = source.lens("loadingState").lens("value").get()
			const promise = loader(continuation)

			promise
				.then(([nextItems]) => {
					if (nextItems.length === 0) {
						source.lens("finished").set(true)
					}

					source.lens("items").modify((prev) => prev.concat(nextItems))
				})
				.catch(() => { /** No-op */ })

			await load(promise, source.lens("loadingState"))

		} else {
			console.warn("Loadable list already finished")
		}
	}
}
