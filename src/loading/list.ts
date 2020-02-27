import {Atom} from "@grammarly/focal"
import {from, List} from "list/methods"
import {Map} from "immutable"
import {loadFull} from "./index"

interface HasId<T> {
	id: T
}

export async function loadList<Id, T extends HasId<Id>>(
	promise: Promise<T[]>,
	ids: Atom<List<Id> | undefined>,
	map: Atom<Map<Id, T>>,
	loading?: Atom<boolean>,
	error?: Atom<any | undefined>,
) {
	await loadFull(
		promise,
		xs => from(xs.map((x) => x.id)),
		xs => map.modify((x) => xs.reduce((m, i) => m.set(i.id, i), x)),
		ids,
		loading,
		error,
	)
}
