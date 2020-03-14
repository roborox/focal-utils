import { fireEvent, render } from "@testing-library/react"
import { InfiniteList } from "./index"
import { ListPartLoader } from "./loadable-list"
import { InfiniteListState, listStateIdle } from "./domain"
import { Atom, reactiveList } from "@grammarly/focal"
import React from "react"
import { Rx } from "@roborox/rxjs-react/build"
import { act } from "react-dom/test-utils"
import { Observable, Subject } from "rxjs"
import { QueueingSubject } from "queueing-subject"
import { first } from "rxjs/operators"

interface Props {
	loader: ListPartLoader<number, number>
	state: Atom<InfiniteListState<number, number>>
}

const List = ({loader, state}: Props) => {
	return (
		<InfiniteList
			state={state}
			loader={loader}
			loading={<span data-testid="loading">loading</span>}
		>{loadNext =>
				<>
					<Rx value={reactiveList(state.view("items"), x => <span key={x} data-testid={`item_${x}`}>{x}</span>)}/>
					<button data-testid="next" onClick={loadNext}>next</button>
				</>
			}</InfiniteList>
	)
}

function range(from: number, to: number) {
	return Array(to - from).fill(0).map((_, idx) => from + idx)
}

function nextValue<T>(o: Observable<T>): Promise<T> {
	return new Promise<T>((resolve, reject) => {
		o.pipe(first()).subscribe(
			x => {
				resolve(x)
			},
			error => {
				reject(error)
			},
		)
	})
}

async function sendNextPage(requests: Observable<[number | null, Subject<[number[], number]>]>) {
	const [c, subject] = await nextValue(requests)
	const start = c || 0
	subject.next([range(start, start + 5), start + 5])
}

describe("InfiniteList", () => {
	test("should load first page at start and then other pages", async () => {
		expect.assertions(7)
		const requests = new QueueingSubject<[number | null, Subject<[number[], number]>]>()

		const loader: ListPartLoader<number, number> = (c) => {
			const result = new Subject<[number[], number]>()
			requests.next([c, result])
			return nextValue(result)
		}
		const state = Atom.create<InfiniteListState<number, number>>(listStateIdle())

		const r = render(<List loader={loader} state={state}/>)
		expect(r.getByTestId("loading")).toHaveTextContent("loading")

		await act(async() => {
			await sendNextPage(requests)
		})
		expect(await r.findByTestId("item_0")).toHaveTextContent("0")
		expect(await r.findByTestId("item_4")).toHaveTextContent("4")
		expect(() => r.getByTestId("item_5")).toThrow()
		expect(() => r.getByTestId("loading")).toThrow()

		await act(async() => {
			fireEvent.click(r.getByTestId("next"))
			await sendNextPage(requests)
		})

		expect(await r.findByTestId("item_5")).toHaveTextContent("5")
		expect(() => r.getByTestId("item_10")).toThrow()
	})
})
