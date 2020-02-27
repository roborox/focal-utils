import {Atom} from "@grammarly/focal"
import {LoadingState} from "./domain"
import {loadList} from "./list"
import {loadArray} from "./array"
import {Loading} from "./component"

async function loadFull<T, R>(
	promise: Promise<T>,
	mapper: (t: T) => R,
	beforeSet: (t: T) => void,
	value: Atom<R | undefined>,
	loading?: Atom<boolean>,
	error?: Atom<any | undefined>,
) {
	loading && loading.set(true)
	error && error.set(undefined)
	try {
		const result = await promise
		beforeSet(result)
		value.set(mapper(result))
		loading && loading.set(false)
	} catch (e) {
		loading && loading.set(false)
		error && error.set(e)
	}
}

async function load<T>(promise: Promise<T>, value: Atom<T>, loading?: Atom<boolean>, error?: Atom<any | undefined>) {
	await loadFull(promise, x => x, () => {}, value, loading, error)
}

export { loadFull, load, LoadingState, loadList, loadArray, Loading }
