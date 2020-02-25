import React from "react"
import { Observable } from "rxjs"
import { useRx } from "./use-rx"

interface Props<T> {
	value: Observable<T>
	children: (t: T) => React.ReactElement
}

export function Rx<T>({value, children}: Props<T>) {
	const simple = useRx(value)
	if (simple !== null) {
		return children(simple)
	}
	return null
}
