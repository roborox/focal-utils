import React from "react"
import { act } from "react-dom/test-utils"
import { F } from "@grammarly/focal"
import { toRx } from "@roborox/rxjs-react/build/to-rx"
import { render } from "@testing-library/react"
import { Loader } from "./loader"

describe("Loader", () => {
	test("should display loader if is loader", async () => {
		expect.assertions(2)
		const [, status] = toRx(new Promise<number>(() => {}))
		const r = render(
			<span data-testid="test">
				<Loader status={status} loading={<span>loading</span>}>
					<span>content</span>
				</Loader>
			</span>,
		)
		await expect(r.getByTestId("test")).toHaveTextContent("loading")
		await expect(r.getByTestId("test")).not.toHaveTextContent("content")
	})

	test("should display content if loaded", async () => {
		expect.assertions(2)
		let resolve: (value: number) => void
		const promise = new Promise<number>((res) => resolve = res)
		const [value, status] = toRx(promise)
		const r = render(
			<span data-testid="test">
				<Loader status={status} loading={<span>loading</span>}>
					<F.span>{value}</F.span>
				</Loader>
			</span>,
		)
		await expect(r.getByTestId("test")).toHaveTextContent("loading")
		const number = Math.random()
		await act(async () => {
			resolve(number)
			await promise
		})
		await expect(r.getByTestId("test")).toHaveTextContent(number.toString())
	})
})
