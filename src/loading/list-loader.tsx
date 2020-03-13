import React from "react"
import { Atom } from "@grammarly/focal"
import { LoaderCases } from "./domain"
import { LoadableListState } from "./loadable-list"
import { Loader } from "./loader"
import { LoadingStatus } from "@roborox/rxjs-react/build/to-rx"

export type ListLoaderProps<D, C> = {
	state: Atom<LoadableListState<D, C>>,
	children: React.ReactElement
} & Omit<LoaderCases<React.ReactElement>, "success">

export const ListLoader = <D, C>({
	state, children, ...restProps
}: ListLoaderProps<D, C>): React.ReactElement | null => {
	const firstLoadStatus = state.view<LoadingStatus>(
		state => state.items.length === 0 ? state.loadingState.status : {status: "success"},
	)
	return <Loader status={firstLoadStatus} {...restProps}>{children}</Loader>
}

ListLoader.displayName = "ListLoader"
