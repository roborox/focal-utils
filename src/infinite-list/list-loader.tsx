import React, { ReactNode } from "react"
import { Atom } from "@grammarly/focal"
import { LoaderCases } from "../loading/domain"
import { Loader } from "../loading/loader"
import { LoadingStatus, loadingStatusSuccess } from "@roborox/rxjs-react/build/to-rx"
import { InfiniteListState } from "./domain"

export type ListLoaderProps<D, C> = {
	state: Atom<InfiniteListState<D, C>>,
	children?: ReactNode
} & Omit<LoaderCases<React.ReactNode>, "success">

export const ListLoader = <D, C>({
	state, children, ...restProps
}: ListLoaderProps<D, C>): React.ReactElement => {
	const firstLoadStatus = state.view<LoadingStatus>(
		state => state.items.length === 0 ? state.status : loadingStatusSuccess,
	)
	return <Loader status={firstLoadStatus} {...restProps}>{children}</Loader>
}

ListLoader.displayName = "ListLoader"
