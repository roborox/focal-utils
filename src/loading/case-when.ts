import { Observable } from "rxjs"
import { map } from "rxjs/operators"
import { LoaderCases, LoadingStatus } from "./domain"

export const caseWhen = <R extends any>(
	status: Observable<LoadingStatus>,
	cases: LoaderCases<R>,
): Observable<R | null> => {
	return status.pipe(
		map(x => {
			switch (x.status) {
				case "loading": {
					return cases.loading
				}
				case "error": {
					return cases.error?.(x.error)
				}
				case "success": {
					return cases.success
				}
				default: {
					return cases.idle
				}
			}
		}),
		map(x => x === undefined ? null : x),
	)
}