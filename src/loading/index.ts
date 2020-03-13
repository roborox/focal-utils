import { Atom } from "@grammarly/focal"
import { LoadingState, LoadingStatus } from "./domain"
import { loadingStatusLoading, loadingStatusSuccess } from "@roborox/rxjs-react/build/to-rx"

export interface LoadAtoms<T> {
	value?: Atom<T>
	status?: Atom<LoadingStatus>,
}

export async function loadFull<T, R>(
	promise: Promise<T>,
	mapper: (t: T) => R,
	value: LoadAtoms<R> | Atom<LoadingState<R>>,
	beforeSet?: (t: T) => void,
): Promise<void> {
	const atoms: LoadAtoms<R> = "get" in value ? stateToAtoms(value) : value
	atoms.status?.set(loadingStatusLoading)

	try {
		const result = await promise
		if (beforeSet) {
			beforeSet(result)
		}
		atoms.value?.set(mapper(result))
		atoms.status?.set(loadingStatusSuccess)
	} catch (e) {
		atoms.status?.set({
			error: e,
			status: "error",
		})
	}
}

export const load = async <T extends any>(
	promise: Promise<T>,
	value: LoadAtoms<T> | Atom<LoadingState<T>>,
): Promise<void> => loadFull(promise, x => x, value)

export const stateToAtoms = <T>(state: Atom<LoadingState<T>>): LoadAtoms<T> => ({
	value: state.lens("value"),
	status: state.lens("status"),
})
