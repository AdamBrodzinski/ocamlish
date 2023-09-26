import { Some, None } from "..";

export type t<a> = a[];

export class ArrayRangeError extends Error {
	name = "ArrayRangeError";
	constructor() {
		super("ArrayRangeError: Expected index to be within range");
		Object.setPrototypeOf(this, ArrayRangeError.prototype);
	}
}

/**
 * Creates a new array of length `n`, filled with value `a`
 *
 * int -> a -> a[]
 *
 * @example
 * ```
 * Array.make(3, "a")
 * > ["a", "a", "a"]
 * ```
 */
export function make<a>(len: number, x: a): a[] {
	return new Array(len).fill(x);
}

/**
 * Creates a new array of length `n`
 *
 * int -> a[]
 *
 * @example
 * ```
 * Array.init<string>(3)
 * > [none, none, none]
 * ```
 */
export function init<a>(len: number): a[] {
	return new Array(len);
}

/**
 * Return the length of an array
 *
 * a[] -> int
 *
 * @example
 * ```
 * Array.length("a", "b")
 * > 2
 * ```
 */
export function length<a>(x: Array<a>) {
	return x.length;
}

/**
 * Returns an Option of the element number `n` of type `a`. If the value is
 * defined it will return Some(a), otherwise it will return None
 *
 * a[] -> int -> Option.t<a>
 *
 * @example
 * ```
 * Array.get(["a", "b"], 1)
 * > Some("b")
 *
 * Array.get(["a", "b"], 100)
 * > None
 * ```
 */
export function get<a>(x: Array<a>, i: number) {
	if (x[i] === null || x[i] === undefined) {
		return None;
	}
	return Some(x[i]);
}

/**
 * Returns type `a` at the index n. If the value is out of range or
 * uninitialized an exception of `ArrayRangeError` will be thrown.
 * If the array contains `null` values, use the get function instead.
 *
 * a[] -> int -> a
 *
 * @example
 * ```
 * Array.get(["a", "b"], 1)
 * > "b"
 *
 * Array.get(["a", "b"], 100)
 * > exception ArrayRangeError
 *
 * Array.get([undefined, undefined], 0)
 * > exception ArrayRangeError
 * ```
 */
export function getExn<a>(x: Array<a>, i: number) {
	if (x[i] === undefined || x[i] === null) {
		throw new ArrayRangeError();
	}
	return x[i];
}
