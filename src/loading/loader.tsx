import React from "react"
import { Observable } from "rxjs"
import { useRx } from "@roborox/rxjs-react/build/use-rx"
import { LoaderCases, LoadingStatus } from "./domain"
import { caseWhen } from "./case-when"

export type LoaderProps = {
	status: Observable<LoadingStatus>,
	children: React.ReactElement
} & Omit<LoaderCases<React.ReactElement>, "success">

export const Loader: React.FC<LoaderProps> = ({ status, children, ...restProps }) => useRx(caseWhen(status, {
	...restProps,
	success: children,
}))

Loader.displayName = "Loader"