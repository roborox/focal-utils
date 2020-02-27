import { Atom } from "@grammarly/focal"
import { Map } from "immutable"
import { LoadAtoms, loadFull, LoadingState } from "./index"

interface HasId<T> {
	id: T
}

interface ArrayAtoms<Id, T extends HasId<Id>> extends LoadAtoms<Id[]> {
	map: Atom<Map<Id, T>>
}

export async function loadArray<Id, T extends HasId<Id>>(
	promise: Promise<T[]>,
	atoms: ArrayAtoms<Id, T>,
) {
	await loadFull(
		promise,
		xs => xs.map((x) => x.id),
		xs => atoms.map.modify((x) => xs.reduce((m, i) => m.set(i.id, i), x)),
		atoms,
	)
}

export function arrayStateToAtoms<Id, T extends HasId<Id>>(
	state: Atom<LoadingState<Id[]>>,
	map: Atom<Map<Id, T>>,
): ArrayAtoms<Id, T> {
	return {
		value: state.lens("value"),
		loading: state.lens("loading"),
		error: state.lens("error"),
		map,
	}
}
