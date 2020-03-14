import React, { ReactNode } from "react"
import { Observable } from "rxjs"
import { useRx } from "@roborox/rxjs-react/build/use-rx"
import { LoaderCases, LoadingStatus } from "./domain"
import { caseWhen } from "./case-when"

export type LoaderProps = {
	status: Observable<LoadingStatus>,
	children?: ReactNode
} & Omit<LoaderCases<ReactNode>, "success">

export const Loader: React.FC<LoaderProps> = ({ status, children, ...restProps }) => {
	const comp = useRx(caseWhen(status, {
		...restProps,
		success: children,
	}))
	return <>{comp}</>
}

Loader.displayName = "Loader"
