import { Atom } from "@grammarly/focal"
import { createLoadingStatusError, loadingStatusSuccess, loadingStatusLoading } from "@roborox/rxjs-react/build"
import { LoadingState, LoadingStatus } from "./domain"

export interface Atoms<T> {
	value?: Atom<T | null>
	status?: Atom<LoadingStatus>,
}

export async function save<T>(
	promise: Promise<T>,
	value: Atoms<T> | Atom<LoadingState<T>>,
): Promise<void> {
	const atoms: Atoms<T> = "get" in value ? stateToAtoms(value) : value
	atoms.status?.set(loadingStatusLoading)

	try {
		const result = await promise
		atoms.value?.set(result)
		atoms.status?.set(loadingStatusSuccess)
	} catch (e) {
		atoms.status?.set(createLoadingStatusError(e))
	}
}

export const stateToAtoms = <T>(state: Atom<LoadingState<T>>): Atoms<T> => ({
	value: state.lens("value"),
	status: state.lens("status"),
})
