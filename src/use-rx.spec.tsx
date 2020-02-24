import { useRx } from "./use-rx"
import { Observable, ReplaySubject } from "rxjs"
import React from "react"
import { render } from "@testing-library/react"
import { Atom } from "@grammarly/focal/dist/_cjs/src/atom"
import { act } from "react-dom/test-utils"

const RxText = ({value, renders}: { value: Observable<string>, renders: Atom<number> }) => {
	const simple = useRx(value)
	renders.modify(x => x + 1)
	return <span data-testid="value">{simple}</span>
}

describe("useRx", () => {
	test("should render atom exactly one time", () => {
		const text = Math.random().toString()
		const renders = Atom.create(0)
		const r = render(<RxText value={Atom.create(text)} renders={renders}/>)
		expect(r.getByTestId("value")).toHaveTextContent(text)
		expect(renders.get()).toStrictEqual(1)
	})

	test("should render ReplaySubject 2 times (1st empty and then real)", () => {
		const renders = Atom.create(0)
		const subject = new ReplaySubject<string>(1)
		const text = Math.random().toString()
		subject.next(text)
		const r = render(<RxText value={subject} renders={renders}/>)
		expect(r.getByTestId("value")).toHaveTextContent(text)
		expect(renders.get()).toStrictEqual(2)
	})

	test("should listen to Atom changes", () => {
		const renders = Atom.create(0)
		const text = Math.random().toString()
		const atom = Atom.create(text)
		const r = render(<RxText value={atom} renders={renders}/>)
		expect(r.getByTestId("value")).toHaveTextContent(text)
		const nextText = Math.random().toString()
		act(() => atom.set(nextText))
		expect(r.getByTestId("value")).toHaveTextContent(nextText)
		expect(renders.get()).toStrictEqual(2)
	})
})
