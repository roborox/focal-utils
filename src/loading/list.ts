import { Atom } from "@grammarly/focal"
import { from, List } from "list/methods"
import { Map } from "immutable"
import { LoadAtoms, loadFull, LoadingState } from "./index"

interface HasId<T> {
	id: T
}

export interface ListAtoms<Id, T extends HasId<Id>> extends LoadAtoms<List<Id>> {
	map: Atom<Map<Id, T>>
}

export async function loadList<Id, T extends HasId<Id>>(
	promise: Promise<T[]>,
	atoms: ListAtoms<Id, T>,
) {
	await loadFull(
		promise,
		xs => from(xs.map((x) => x.id)),
		xs => atoms.map.modify((x) => xs.reduce((m, i) => m.set(i.id, i), x)),
		atoms,
	)
}

export function listStateToAtoms<Id, T extends HasId<Id>>(
	state: Atom<LoadingState<List<Id>>>,
	map: Atom<Map<Id, T>>,
): ListAtoms<Id, T> {
	return {
		value: state.lens("value"),
		loading: state.lens("loading"),
		error: state.lens("error"),
		map,
	}
}
