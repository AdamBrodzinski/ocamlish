import { expect, test, jest } from "bun:test";
import { Array, Some, None } from "../index";

test("Array.make creates an array of size n, filled with type a", () => {
	const result: string[] = Array.make(3, "a");
	expect(result).toEqual(["a", "a", "a"]);
});

test("Array.init creates an array of size n without values", () => {
	const result: string[] = Array.init<string>(3);
	expect(result.length).toEqual(3);
});

test("Array.length returns length of array", () => {
	const result: number = Array.length([1, 2, 3]);
	expect(result).toEqual(3);
});

test("Array.get returns the value Some(a) at index (n)", () => {
	const data = ["a", "b", "c"];
	const result = Array.get(data, 1);
	expect(result).toEqual(Some("b"));
});

test("Array.get returns None if n is out of range or undefined", () => {
	const data = ["a", "b", "c"];
	const result = Array.get(data, 10);
	expect(result).toEqual(None);
});

test("Array.get returns None if element is null", () => {
	const data = ["a", "b", null];
	const result = Array.get(data, 2);
	expect(result).toEqual(None);
});

test("Array.getExn throws if n is out of range", () => {
	const errMsg = "ArrayRangeError: Expected index to be within range";
	const makeError = () => Array.getExn([], 10);
	expect(makeError).toThrow(errMsg);
});

test("Array.getExn throws if n is undefined or null", () => {
	const errMsg = "ArrayRangeError: Expected index to be within range";
	const makeError = () => Array.getExn([undefined], 0);
	const makeError2 = () => Array.getExn([null], 0);
	expect(makeError).toThrow(errMsg);
	expect(makeError2).toThrow(errMsg);
});

test("Array.getExn throws if n is uninitialized", () => {
	const errMsg = "ArrayRangeError: Expected index to be within range";
	const makeError = () => Array.getExn(Array.init(10), 0);
	expect(makeError).toThrow(errMsg);
});
