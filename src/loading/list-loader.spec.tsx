import React from "react"
import { Atom } from "@grammarly/focal"
import { act } from "react-dom/test-utils"
import { render, waitForElement } from "@testing-library/react"
import { LoadPageContinuation, ApiData, api } from "../../test/fixtures/api"
import { LoadableListState, loadableListStateIdle, createLoadableList, LoadableListLoader } from "./loadable-list"
import { ListLoader } from "./list-loader"

type MyListState = LoadableListState<ApiData, LoadPageContinuation>

let appState: Atom<{
	myList: MyListState
}> = Atom.create({
	myList: loadableListStateIdle(),
})

const loader: LoadableListLoader<ApiData, LoadPageContinuation> = async (continuation) => {
	const page = continuation || 0
	const nextItems = await api.loadPage(page, 10)
	return [nextItems, page + 1]
}
const myList = appState.lens("myList")
const load = createLoadableList<ApiData, LoadPageContinuation>(loader, myList)

describe("list-loader", () => {
	beforeEach(() => {
		appState = Atom.create({
			myList: loadableListStateIdle(),
		})
	})

	test("should create ListLoader and fetch some data", async () => {
		expect.assertions(4)
		const tree = render(
			<ListLoader
				state={myList}
				loading={<span data-testid="loading">loading</span>}
				idle={<span data-testid="idle">idle</span>}
			>
				<span data-testid="content">content</span>
			</ListLoader>,
		)

		expect(tree.getByTestId("idle")).toBeTruthy()
		act(() => {
			load()
		})
		expect(tree.getByTestId("loading")).toBeTruthy()
		await waitForElement(() => tree.getByTestId("content"))
		expect(tree.getByTestId("content")).toBeTruthy()

		act(() => {
			load()
		})
		expect(tree.getByTestId("content")).toBeTruthy()
	})
})