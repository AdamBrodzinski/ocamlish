import { expect, test, jest } from "bun:test";
import { Result, Err, Ok } from "../index";
const { ResultMatchError } = Result;

test("ResultMatchError extends Error class", () => {
	const err = new ResultMatchError(Err("It failed"));
	const expectedMessage =
		"ResultMatchError: Expected a result of type Ok(a) but got Err(b)";
	expect(err.name).toEqual("ResultMatchError");
	expect(err.message).toEqual(expectedMessage);
});

test("ResultMatchError includes mismatched result", () => {
	const err = new ResultMatchError(Err(70));
	expect(err.data).toEqual({ t: "Err", val: 70 });
});

test("Result.Ok returns value in boxed type", () => {
	let result = Ok(23);
	expect(result.val).toEqual(23);
});

test("Result.Err returns value in boxed type", () => {
	let result = Err("could_not_find_thing");
	expect(result.val).toEqual("could_not_find_thing");
});

test("Result type is readable at runtime", () => {
	let result1 = Ok({ id: 1 });
	let result2 = Err("Whoops");
	expect(result1.t).toEqual("Ok");
	expect(result2.t).toEqual("Err");
});

test("Result.isErr returns true if Err result", () => {
	let result = Err("could_not_find_thing");
	expect(Result.isErr(result)).toBeTrue();
});

test("Result.isErr returns false if Ok result", () => {
	let result = Ok(1);
	expect(Result.isErr(result)).toBeFalse();
});

test("Result.isOk returns true if Ok result", () => {
	let result = Ok(23);
	expect(Result.isOk(result)).toBeTrue();
});

test("Result.isOk returns false if Err result", () => {
	expect(Result.isOk(Err("fetch_failed"))).toBeFalse();
});

test("Result.match success callback is called with Ok", () => {
	const args = { Ok: jest.fn(), Err: jest.fn() };
	Result.match(Ok(23), args);
	expect(args.Ok).toHaveBeenCalled();
	expect(args.Err).not.toHaveBeenCalled();
	expect(args.Ok.mock.calls).toEqual([[23]]);
});

test("Result.matchResult error callback is called with Err", () => {
	const args = { Ok: jest.fn(), Err: jest.fn() };
	Result.match(Err("Error"), args);
	expect(args.Ok).not.toHaveBeenCalled();
	expect(args.Err).toHaveBeenCalled();
	expect(args.Err.mock.calls).toEqual([["Error"]]);
});

test("Result.matchResult returns Ok result expression", () => {
	const result = Result.match(Ok(10), {
		Ok: (x) => x + 1,
		Err: (msg) => msg,
	});
	expect(result).toEqual(11);
});

test("Result.matchResult returns Err result expression", () => {
	const result = Result.match(Err("fail"), {
		Ok: (x) => x,
		Err: (msg) => `${msg}: try again`,
	});
	expect(result).toEqual("fail: try again");
});

test("Result.matchResult return type matches callback return values", () => {
	// testing inferred `result` type matches fn return types without ts error
	const result: boolean | number[] = Result.match(Err(23), {
		Ok: (_val) => true,
		Err: (val) => [val],
	});
	expect(result).not.toBeUndefined();
});

test("Result.get returns the value of Ok", () => {
	const result = Ok(100);
	const val = Result.get(result, 0);
	expect(val).toBe(100);
});

test("Result.get returns fallback value if result is Err", () => {
	const result = Err("Oh no it failed");
	const val = Result.get(result, 0);
	expect(val).toBe(0);
});

test("Result.getExn returns the value of Ok", () => {
	const result = Ok(100);
	const val = Result.getExn(result);
	expect(val).toBe(100);
});

test("Result.getExn throws if result is of type Err", () => {
	const result = Err("whoops");
	const callBadMatch = () => Result.getExn(result);
	expect(callBadMatch).toThrow("ResultMatchError");
});

test("Result.partition separates results into ok/error lists", () => {
	const results = [Ok(10), Err("invalid"), Ok(30)];
	expect(Result.partition(results)).toEqual([
		[Ok(10), Ok(30)],
		[Err("invalid")],
	]);
});

test("Result.map returns the same Err if Result is Err", () => {
	const result1: Result.t<number, string> = Err("fail");
	const result2 = Result.map((x) => x + 1, result1);
	expect(result2.val).toBe("fail");
});

test("Result.map applies fn on result if it is type Ok", () => {
	const result1: Result.t<number, string> = Ok(10);
	const result2 = Result.map((x) => x + 1, result1);
	expect(result2.val).toBe(11);
});

test("Result.map can be partially applied with Ok result", () => {
	const result1: Result.t<string, Error> = Ok("Hello");
	const appendWorldIfOk = Result.map((x: string) => x + "World");
	const result2 = appendWorldIfOk(result1);
	expect(result2.val).toBe("HelloWorld");
});

test("Result.map can be partially applied with Err result", () => {
	const result1: Result.t<number, string> = Err("failed");
	const addOneIfOk = Result.map((x: number) => x + 1);
	const result2 = addOneIfOk(result1);
	expect(result2.val).toBe("failed");
});
