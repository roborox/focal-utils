import React, { useEffect, useMemo } from "react"
import { Atom } from "@grammarly/focal"
import { createLoadNext, ListPartLoader } from "./create-load-next"
import { ListLoader } from "./list-loader"
import { InfiniteListState } from "./domain"

export interface InfiniteListProps<T, C> {
	state: Atom<InfiniteListState<T, C>>
	loader: ListPartLoader<T, C>
	loading?: React.ReactNode,
	error?: (err: any, loadNext: () => void) => React.ReactNode,
	children?: (loadNext: () => void) => React.ReactNode
}

export function InfiniteList<T, C>({ state, loader, loading, error, children }: InfiniteListProps<T, C>) {
	const load = useMemo(() => createLoadNext(loader, state), [state, loader])

	useEffect(() => {
		const current = state.get()
		if (current.items.length === 0 && current.status.status === "idle") {
			load().then()
		}
	}, [])

	return (
		<ListLoader state={state} loading={loading} error={e => error?.(e, load)}>
			{children?.(load)}
		</ListLoader>
	)
}
