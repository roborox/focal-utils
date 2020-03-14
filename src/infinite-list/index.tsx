import { Atom } from "@grammarly/focal"
import { createLoadNext, ListPartLoader } from "./loadable-list"
import { ListLoader } from "./list-loader"
import React, { useEffect } from "react"
import { InfiniteListState } from "./domain"

export interface Props<T, C> {
	state: Atom<InfiniteListState<T, C>>
	loader: ListPartLoader<T, C>
	loading?: React.ReactNode,
	error?: (err: any, loadNext: () => void) => React.ReactNode,
	children?: (loadNext: () => void) => React.ReactNode
}

export function InfiniteList<T, C>({state, loader, loading, error, children}: Props<T, C>) {
	const load = createLoadNext(loader, state)
	useEffect(() => {
		const s = state.subscribe(x => {
			if (x.items.length === 0 && x.status.status === "idle") {
				load().then()
			}
		})
		return () => s.unsubscribe()
	}, [])
	return <ListLoader state={state} loading={loading} error={e => error?.(e, load)}>{children?.(load)}</ListLoader>
}
