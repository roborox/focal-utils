import React from "react"
import { fireEvent, render } from "@testing-library/react"
import { Atom, reactiveList } from "@grammarly/focal"
import { Rx } from "@roborox/rxjs-react/build/rx"
import { act } from "react-dom/test-utils"
import { Observable, Subject } from "rxjs"
import { QueueingSubject } from "queueing-subject"
import { first, map } from "rxjs/operators"
import { InfiniteList } from "./index"
import { ListPartLoader } from "./create-load-next"
import { range } from "../../test/utils/range"
import { InfiniteListState, listStateIdle } from "./domain"

const Renderable = ({ loader, state }: {
	loader: ListPartLoader<number, number>
	state: Atom<InfiniteListState<number, number>>
}) => (
	<InfiniteList
		state={state}
		error={(error, reload) => (
			<button data-error={(error as Error).message} onClick={reload} data-testid="reload">reload</button>
		)}
		loader={loader}
		loading={<span data-testid="loading">loading</span>}
	>
		{load =>
			<>
				<Rx value={reactiveList(state.view("items"), x =>
					<span key={x} data-testid={`item_${x}`}>{x}</span>,
				)}>
					{(renderable) => <div>{renderable}</div>}
				</Rx>
				<button data-testid="next" onClick={load}>
					next
				</button>
				<Rx value={state.pipe(map(({ status }) => status))}>
					{t => <span data-testid="status">{t.status}</span>}
				</Rx>
			</>
		}
	</InfiniteList>
)

type RequestData = [number | null, Subject<[number[], number]>]

async function sendNextPage(requests: Observable<RequestData>) {
	const [page, subject] = await requests.pipe(first()).toPromise()
	const startPage = page || 0
	subject.next([
		range(startPage, startPage + 5),
		startPage + 5,
	])
}

async function sendError(requests: Observable<RequestData>, error: any) {
	const [, subject] = await requests.pipe(first()).toPromise()
	subject.error(error)
}

const createPartLoader = (requests: Subject<RequestData>): ListPartLoader<number, number> => {
	return (continuation) => {
		const result = new Subject<[number[], number]>()
		requests.next([continuation, result])
		return result.pipe(first()).toPromise()
	}
}

describe("InfiniteList", () => {
	let state: Atom<InfiniteListState<number, number>>
	beforeEach(() => {
		state = Atom.create(listStateIdle())
	})

	test("should load first page at start and then other pages", async () => {
		expect.assertions(8)
		const requests = new QueueingSubject<RequestData>()
		const partLoader: ListPartLoader<number, number> = createPartLoader(requests)

		const r = render(<Renderable loader={partLoader} state={state}/>)
		act(() => {
			sendNextPage(requests)
		})
		expect(await r.getByTestId("loading")).toHaveTextContent("loading")
		expect(await r.findByTestId("item_0")).toHaveTextContent("0")
		expect(await r.findByTestId("item_4")).toHaveTextContent("4")
		expect(() => r.getByTestId("item_5")).toThrow()
		expect(() => r.getByTestId("loading")).toThrow()

		act(() => {
			fireEvent.click(r.getByTestId("next"))
			sendNextPage(requests)
		})

		expect(r.getByTestId("status")).toHaveTextContent("loading")
		expect(await r.findByTestId("item_5")).toHaveTextContent("5")
		expect(() => r.getByTestId("item_10")).toThrow()
	})

	test("should fail first page loader and then retry with success", async () => {
		expect.assertions(8)
		const ERROR_MESSAGE = "error"

		const requests = new QueueingSubject<[number | null, Subject<[number[], number]>]>()
		const partLoader = createPartLoader(requests)

		const r = render(<Renderable loader={partLoader} state={state}/>)
		await act(() => sendError(requests, new Error(ERROR_MESSAGE)))

		expect(r.getByTestId("reload")).toBeTruthy()
		expect(r.getByTestId("reload")).toHaveAttribute("data-error", ERROR_MESSAGE)

		act(() => {
			fireEvent.click(r.getByTestId("reload"))
		})

		expect(() => r.getByTestId("reload")).toThrow()
		expect(await r.getByTestId("loading")).toHaveTextContent("loading")

		await act(() => sendNextPage(requests))
		expect(await r.findByTestId("item_0")).toHaveTextContent("0")

		act(() => {
			fireEvent.click(r.getByTestId("next"))
		})

		expect(r.getByTestId("status")).toHaveTextContent("loading")

		await act(() => sendNextPage(requests))
		expect(await r.findByTestId("item_5")).toHaveTextContent("5")
		expect(() => r.getByTestId("item_10")).toThrow()
	})
})
