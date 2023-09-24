// ocaml style module t when module is exported (Result.t)
export type t<a> = Some<a> | None;

// refer to Result interally for on hover readability
type Option<a> = t<a>;
type Some<T> = T & { readonly t: "Some" };
type None = null & { readonly t: "None" };

export class OptionGetError extends Error {
	name = "OptionGetError";
	constructor() {
		super("OptionGetError: Expected Some(a) but found None");
		Object.setPrototypeOf(this, OptionGetError.prototype);
	}
}

export function Some<A>(a: A) {
	return a as Some<A>;
}

export const None = null as None;

export function equal<a>(x: Option<a>): (y: Option<a>) => boolean;
export function equal<a>(x: Option<a>, y: Option<a>): boolean;
export function equal<a>(x: Option<a>, y?: Option<a>) {
	if (arguments.length === 1) {
		return (y: Option<a>) => x === y;
	}
	return x === y;
}

export function isNone<a>(x: Option<a>): x is None {
	return x === null;
}

export function isSome<A>(a: Option<A>): a is Some<A> {
	return a !== null;
}

export function match<A, B, C>(
	a: Option<A>,
	callbacks: {
		Some: (res: A) => B;
		None: () => C;
	},
) {
	// if typesystem fails, undefined is also None
	if (a === null || a === undefined) {
		return callbacks.None();
	}
	return callbacks.Some(a);
}

/** Extracts the value out of an Ok result or returns fallback */
export function get<A>(a: Option<A>, fallback: A) {
	if (a === null || a === undefined) {
		return fallback;
	}
	return a;
}

/** get the value of Ok result. Throws exception if result is Err */
export function getExn<A>(a: Option<A>) {
	if (a === null || a === undefined) {
		throw new OptionGetError();
	}
	return a;
}

export function map<A, B>(fn: (x: A) => B, a: Option<A>): Option<B>;
export function map<A, B>(fn: (X: A) => B): (a: Option<A>) => Option<B>;
export function map<A, B>(fn: (x: A) => B, a?: Option<A>) {
	if (arguments.length === 1) {
		return (x: A) => fn(x);
	}
	if (a === null || a === undefined) {
		return None;
	}
	return fn(a);
}
