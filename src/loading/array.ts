import {Atom} from "@grammarly/focal"
import {Map} from "immutable"
import {loadFull} from "./index"

interface HasId<T> {
	id: T
}

export async function loadArray<Id, T extends HasId<Id>>(
	promise: Promise<T[]>,
	ids: Atom<Id[] | undefined>,
	map: Atom<Map<Id, T>>,
	loading?: Atom<boolean>,
	error?: Atom<any | undefined>,
) {
	await loadFull(
		promise,
		xs => xs.map((x) => x.id),
		xs => map.modify((x) => xs.reduce((m, i) => m.set(i.id, i), x)),
		ids,
		loading,
		error,
	)
}
