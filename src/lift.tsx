import React from "react"
import { Observable } from "rxjs"
import { useRx } from "./use-rx"

type Observed<T> = {
	[K in keyof T]: Observable<T[K]>;
}

export function lift<Props, K extends keyof Props>(
	Component: React.ComponentType<Props>,
	key: K,
): React.FC<Omit<Props, K> & Observed<Pick<Props, K>>> {
	return (props) => {
		// @ts-ignore
		const value = useRx(props[key] as Observable<Props[K]>)
		if (value !== null) {
			const resultProps = {...props}
			resultProps[key] = value
			// @ts-ignore
			return <Component {...resultProps}/>
		} else {
			return null
		}
	}
}
