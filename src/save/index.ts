import { Atom } from "@grammarly/focal"
import { createLoadingStatusError, loadingStatusSuccess, loadingStatusLoading } from "@roborox/rxjs-react/build"
import { LoadingState, LoadingStatus } from "./domain"

export interface LoadAtoms<T> {
	value?: Atom<T | null>
	status?: Atom<LoadingStatus>,
}

export async function save<T>(
	promise: Promise<T>,
	value: LoadAtoms<T> | Atom<LoadingState<T>>,
): Promise<void> {
	const atoms: LoadAtoms<T> = "get" in value ? stateToAtoms(value) : value
	atoms.status?.set(loadingStatusLoading)

	try {
		const result = await promise
		atoms.value?.set(result)
		atoms.status?.set(loadingStatusSuccess)
	} catch (e) {
		atoms.status?.set(createLoadingStatusError(e))
	}
}

export const stateToAtoms = <T>(state: Atom<LoadingState<T>>): LoadAtoms<T> => ({
	value: state.lens("value"),
	status: state.lens("status"),
})
