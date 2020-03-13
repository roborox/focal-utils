import { Atom } from "@grammarly/focal"
import { load } from "."
import { LoadingStatus, loadingStatusIdle } from "@roborox/rxjs-react/build/to-rx"

export type LoadableListLoader<D, C> = (continuation: C | null) => Promise<[D[], C]>

export type LoadableListState<D, C> = {
	items: D[],
	status: LoadingStatus,
	continuation: C | null,
	finished: boolean,
}

export const loadableListStateIdle = <D, C>(): LoadableListState<D, C> => ({
	items: [],
	status: loadingStatusIdle,
	continuation: null,
	finished: false,
})

export const createLoadableList = <D, C>(loader: LoadableListLoader<D, C>, source: Atom<LoadableListState<D, C>>) => {
	return async () => {
		const finishedLens = source.lens("finished")

		if (!finishedLens.get()) {
			const promise = loader(source.lens("continuation").get())

			await load(promise, { status: source.lens("status") })

			promise
				.then(([nextItems, continuation]) => {
					if (nextItems.length === 0) {
						finishedLens.set(true)
					}

					source.lens("items").modify((prev) => prev.concat(nextItems))
					source.lens("continuation").set(continuation)
				})
				.catch(() => { /** No-op */ })

		} else {
			console.warn("Loadable list already finished")
		}
	}
}
