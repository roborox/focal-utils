import { render } from "@testing-library/react"
import { InfiniteList } from "./index"
import { ListPartLoader } from "./loadable-list"
import { InfiniteListState, listStateIdle } from "./domain"
import { Atom, reactiveList } from "@grammarly/focal"
import React from "react"
import { Rx } from "@roborox/rxjs-react/build"

interface Props {
	loader: ListPartLoader<number, number>
	state: Atom<InfiniteListState<number, number>>
}

const List = ({loader, state}: Props) => {
	return (
		<InfiniteList state={state} loader={loader}>{loadNext =>
			<>
				<Rx value={reactiveList(state.view("items"), x => <span data-testid={`item_${x}`}>{x}</span>)}/>
				<input type="button"/>
			</>
		}</InfiniteList>
	)
}

function range(from: number, to: number) {
	return Array(to - from).fill(0).map((_, idx) => from + idx)
}

describe("InfiniteList", () => {
	test("should load first page at start", async () => {
		expect.assertions(1)
		const loader: ListPartLoader<number, number> = async (c) => {
			const start = c || 0
			return [range(start, start + 20), start + 20]
		}
		const state = Atom.create<InfiniteListState<number, number>>(listStateIdle())
		const r = render(<List loader={loader} state={state}/>)
		expect(await r.findByTestId("item_0")).toHaveTextContent("0")
	})
})
