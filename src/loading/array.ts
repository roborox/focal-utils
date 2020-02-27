import {Atom} from "@grammarly/focal"
import {Map} from "immutable"
import {loadFull} from "./index"
import {LoadingState} from "./domain"

interface HasId<T> {
	id: T
}

export async function loadArray<Id, T extends HasId<Id>>(
	promise: Promise<T[]>,
	ids: Atom<LoadingState<Id[]>>,
	map: Atom<Map<Id, T>>,
) {
	await loadFull(
		promise,
		ids,
		xs => xs.map((x) => x.id),
		xs => map.modify((x) => xs.reduce((m, i) => m.set(i.id, i), x)),
	)
}
