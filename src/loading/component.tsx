import React from "react"
import { Atom } from "@grammarly/focal"
import { Observable } from "rxjs"
import { distinctUntilChanged, map } from "rxjs/operators"
import { LoadingState } from "./domain"
import { useRx } from "@roborox/rxjs-react/build/use-rx"

interface Props<T> extends Omit<Cases<T, React.ReactElement | null>, "success"> {
	atom: Atom<LoadingState<T>>
	children: React.ReactElement | ((value: Atom<T>, loading: Atom<boolean>) => React.ReactElement | null)
}

export function Loading<T>({atom, ...rest}: Props<T>) {
	const cases: Cases<T, React.ReactElement | null> = {...rest, success: () => null}
	if (typeof rest.children === "function") {
		cases.success = rest.children
	} else {
		cases.success = () => rest.children as React.ReactElement
	}
	return useRx(caseWhen(atom, cases), cases.idle?.() || null)
}

interface Cases<T, R> {
	idle?: () => R
	loading?: () => R
	error?: (error: any) => R
	success: (value: Atom<T>, loading: Atom<boolean>) => R
}

function caseWhen<T, R>(atom: Atom<LoadingState<T>>, cases: Cases<T, R>): Observable<R | null> {
	const value = atom.lens("value")
	const loading = atom.lens("loading")
	return atom.pipe(
		distinctUntilChanged((i1, i2) => getState(i1) === getState(i2)),
		map(x => {
			if (x.value === undefined && x.loading) {
				return cases.loading?.()
			}
			if (x.value === undefined) {
				return cases.idle?.()
			}
			if (x.error !== undefined) {
				return cases.error?.(x.error)
			}
			return cases.success(value as Atom<T>, loading)
		}),
		map(x => x === undefined ? null : x),
	)
}

function getState(s: LoadingState<any>) {
	if (s.value === undefined && s.loading) return "loading"
	if (s.value === undefined) return "idle"
	if (s.error !== undefined) return "error"
	return "success"
}
