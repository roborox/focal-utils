import React, { useEffect, useMemo } from "react"
import { Atom } from "@grammarly/focal"
import { createLoadNext, ListPartLoader } from "./loadable-list"
import { ListLoader } from "./list-loader"
import { InfiniteListState } from "./domain"
import { LoadingStatus } from "../loading/domain"

export type InfiniteListProps<T, C> = {
	state: Atom<InfiniteListState<T, C>>
	loader: ListPartLoader<T, C>
	loading?: React.ReactNode,
	error?: (err: any, loadNext: () => void) => React.ReactNode,
	children?: (loadNext: () => void, status: Atom<LoadingStatus>) => React.ReactNode
}

export function InfiniteList<T, C>({ state, loader, loading, error, children }: InfiniteListProps<T, C>) {
	const load = useMemo(() => createLoadNext(loader, state), [state, loader])

	useEffect(() => {
		const current = state.get()
		if (current.items.length === 0 && current.status.status === "idle") {
			load()
		}
	}, [])

	return (
		<ListLoader state={state} loading={loading} error={e => error?.(e, load)}>
			{children?.(load, state.lens("status"))}
		</ListLoader>
	)
}

InfiniteList.displayName = "InfiniteList"