import React from "react"
import { Atom } from "@grammarly/focal"
import { LoadingStatus, Cases, loadingStatusSuccess, Loader } from "@roborox/rxjs-react/build"
import { InfiniteListState } from "./domain"

export interface ListLoaderProps<D, C> extends Omit<Cases<React.ReactNode>, "success"> {
	state: Atom<InfiniteListState<D, C>>,
	children?: React.ReactNode
}

export function ListLoader<D, C>({ state, children, ...restProps }: ListLoaderProps<D, C>): React.ReactElement {
	const firstLoadStatus = state.view<LoadingStatus>(
		state => state.items.length === 0 ? state.status : loadingStatusSuccess,
	)
	return <Loader status={firstLoadStatus} {...restProps}>{children}</Loader>
}
