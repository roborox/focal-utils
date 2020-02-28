import { Atom } from "@grammarly/focal"
import { LoadingState } from "./domain"

export interface LoadAtoms<T> {
	value: Atom<T | undefined>
	loading?: Atom<boolean>,
	error?: Atom<any | undefined>
}

export async function loadFull<T, R>(
	promise: Promise<T>,
	mapper: (t: T) => R,
	beforeSet: (t: T) => void,
	value: LoadAtoms<R> | Atom<LoadingState<R>>,
): Promise<void> {
	const atoms: LoadAtoms<R> = "get" in value ? stateToAtoms(value) : value
	atoms.loading?.set(true)
	atoms.error?.set(undefined)
	try {
		const result = await promise
		beforeSet(result)
		atoms.value.set(mapper(result))
		atoms.loading?.set(false)
	} catch (e) {
		atoms.loading?.set(false)
		atoms.error?.set(e)
	}
}

export async function load<T>(
	promise: Promise<T>,
	value: LoadAtoms<T> | Atom<LoadingState<T>>,
): Promise<void> {
	await loadFull(promise, x => x, () => {}, value)
}

export function stateToAtoms<T>(state: Atom<LoadingState<T>>): LoadAtoms<T> {
	return {
		value: state.lens("value"),
		loading: state.lens("loading"),
		error: state.lens("error"),
	}
}
