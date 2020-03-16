import { Atom } from "@grammarly/focal"
import { InfiniteListState } from "./domain"
import { save } from "../save"

export type ListPartLoader<D, C> = (continuation: C | null) => Promise<[D[], C]>

export const createLoadNext = <D, C>(loader: ListPartLoader<D, C>, source: Atom<InfiniteListState<D, C>>) => {
	return async () => {
		const finishedLens = source.lens("finished")

		if (!finishedLens.get()) {
			const promise = loader(source.lens("continuation").get())

			await save(promise, { status: source.lens("status") })

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
