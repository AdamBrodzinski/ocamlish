export type t<a, b> = Ok<a> | Err<b>;

// refer to Result interally for on hover readability
type Result<a, b> = t<a, b>;
type Ok<T> = { val: T; readonly t: "Ok" };
type Err<T> = { val: T; readonly t: "Err" };

export class ResultMatchError<E> extends Error {
	name = "ResultMatchError";
	data: E;
	constructor(data: E) {
		super("ResultMatchError: Expected a result of type Ok(a) but got Err(b)");
		this.data = data;
	}
}

export function Ok<a>(x: a) {
	return { val: x, t: "Ok" } as Ok<a>;
}

export function Err<a>(x: a) {
	return { val: x, t: "Err" } as Err<a>;
}

export function isErr(x: Result<unknown, unknown>) {
	return x.t === "Err";
}

export function isOk(x: Result<unknown, unknown>) {
	return x.t === "Ok";
}

export function match<OkT, ErrT, OkRet, ErrRet>(
	x: Result<OkT, ErrT>,
	callbacks: {
		Ok: (res: OkT) => OkRet;
		Err: (res: ErrT) => ErrRet;
	},
) {
	if (x.t === "Ok") {
		return callbacks.Ok(x.val);
	}
	return callbacks.Err(x.val);
}

/** Extracts the value out of an Ok result or returns fallback */
export function get<a, b>(x: Result<a, b>, fallback: a) {
	if (x.t === "Ok") {
		return x.val;
	}
	return fallback;
}

/** get the value of Ok result. Throws exception if result is Err */
export function getExn<a, b>(x: Result<a, b>) {
	if (x.t === "Ok") {
		return x.val;
	}
	throw new ResultMatchError(x);
}

export function partition<a, b>(results: Result<a, b>[]) {
	let i = 0,
		errs = [],
		oks = [];
	while (i < results.length) {
		if (results[i].t === "Ok") {
			oks.push(results[i]);
		} else {
			errs.push(results[i]);
		}
		i++;
	}
	return [oks, errs];
}
