import React from "react"
import { Atom } from "@grammarly/focal"
import { Observable } from "rxjs"
import { distinctUntilChanged, map } from "rxjs/operators"
import { LoadingState } from "./domain"
import { useRx } from "@roborox/rxjs-react/build/use-rx"

interface Props<T, R extends React.ReactElement> extends Cases<T, R> {
	atom: Atom<LoadingState<T>>
}

export function Loading<T, R extends React.ReactElement>({atom, ...cases}: Props<T, R>) {
	return useRx(caseWhen(atom, cases), cases.idle())
}

interface Cases<T, R> {
	idle: () => R
	loading: () => R
	error: (error: any) => R
	success: (value: Atom<T>, loading: Atom<boolean>) => R
}

function caseWhen<T, R>(atom: Atom<LoadingState<T>>, cases: Cases<T, R>): Observable<R> {
	const value = atom.lens("value")
	const loading = atom.lens("loading")
	return atom.pipe(
		distinctUntilChanged((i1, i2) => getState(i1) === getState(i2)),
		map(x => {
			if (x.value === undefined && x.loading) {
				return cases.loading()
			}
			if (x.value === undefined) {
				return cases.idle()
			}
			if (x.error !== undefined) {
				return cases.error(x.error)
			}
			return cases.success(value as Atom<T>, loading)
		}),
	)
}

function getState(s: LoadingState<any>) {
	if (s.value === undefined && s.loading) return "loading"
	if (s.value === undefined) return "idle"
	if (s.error !== undefined) return "error"
	return "success"
}
