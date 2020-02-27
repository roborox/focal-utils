import {Atom} from "@grammarly/focal"
import {LoadingState} from "./domain"
import { loadList } from "./list"
import { loadArray } from "./array"
import { Loading } from "./component"

async function loadFull<T, R>(
	promise: Promise<T>,
	atom: Atom<LoadingState<R>>,
	mapper: (t: T) => R,
	beforeSet: (t: T) => void,
) {
	atom.modify(x => ({...x, loading: true, error: undefined}))
	try {
		const result = await promise
		beforeSet(result)
		atom.set({loading: false, error: undefined, value: mapper(result)})
	} catch (e) {
		atom.modify(x => ({...x, error: e}))
	}
}

async function load<T>(promise: Promise<T>, atom: Atom<LoadingState<T>>) {
	await loadFull(promise, atom, x => x, () => {})
}

export { loadFull, load, LoadingState, loadList, loadArray, Loading }
