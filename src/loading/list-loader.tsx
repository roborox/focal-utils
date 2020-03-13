import React from "react"
import { Atom } from "@grammarly/focal"
import { map } from "rxjs/operators"
import { useRx } from "@roborox/rxjs-react/build/use-rx"
import { LoaderCases } from "./domain"
import { LoadableListState } from "./loadable-list"
import { Loader } from "./loader"

export type ListLoaderProps<D, C> = {
	state: Atom<LoadableListState<D, C>>,
	children: React.ReactElement
} & Omit<LoaderCases<React.ReactElement>, "success">

export const ListLoader = <D, C>({
	state, children, ...restProps
}: ListLoaderProps<D, C>): React.ReactElement | null => {
	const isFirstTimeLoading = useRx(state.pipe(map((state) => {
		return state.items.length === 0
	})))

	if (isFirstTimeLoading !== null) {
		if (isFirstTimeLoading) {
			return (
				<Loader status={state.pipe(map((state) => state.loadingState.status))} {...restProps}>
					{children}
				</Loader>
			)
		}

		return children
	}
	return null
}

ListLoader.displayName = "ListLoader"