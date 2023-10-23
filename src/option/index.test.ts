import { expect, test, jest } from "bun:test";
import { Option, Some, None } from "../index";
const { OptionGetError } = Option;

test("OptionGetError extends Error class", () => {
	const err = new OptionGetError();
	const expectedMessage = "OptionGetError: Expected Some(a) but found None";
	expect(err.name).toEqual("OptionGetError");
	expect(err.message).toEqual(expectedMessage);
});

test("Option.equals compares with ===", () => {
	expect(Option.equal(Some("foo"), Some("foo"))).toEqual(true);
	expect(Option.equal(Some("foo"), Some("bar"))).toEqual(false);
	expect(Some(10)).toEqual(Some(10));
	expect(Some(10)).toEqual(Some(5) + Some(5));
	expect(Some(10) === 10).toEqual(true);
});

test("Option.equals partially applies", () => {
	const data = { one: "foo", two: "bar" };
	const isFoo = Option.equal(Some(data.one));
	expect(isFoo(Some(data.one))).toEqual(true);
	expect(isFoo(Some(data.two))).toEqual(false);
});

test("Option.Some returns value with some type", () => {
	let result = Some(10);
	expect(result).toEqual(10);
});

test("Option.isNone returns true if value is null", () => {
	expect(Option.isNone(None)).toBeTrue();
});

test("Option.isNone returns false if value is Option + not null", () => {
	expect(Option.isNone(Some(30))).toBeFalse();
});

test("Option.isSome returns true if value is null", () => {
	expect(Option.isSome(None)).toBeFalse();
});

test("Option.isSome returns false if value is Option + not null", () => {
	expect(Option.isSome(Some("test"))).toBeTrue();
});

test("Option.match Some callback is called with Some value", () => {
	const args = { Some: jest.fn(), None: jest.fn() };
	Option.match(Some(10), args);
	expect(args.Some).toHaveBeenCalled();
	expect(args.None).not.toHaveBeenCalled();
	expect(args.Some.mock.calls).toEqual([[10]]);
});

test("Option.match None callback is called with None value", () => {
	const args = { Some: jest.fn(), None: jest.fn() };
	Option.match(None, args);
	expect(args.Some).not.toHaveBeenCalled();
	expect(args.None).toHaveBeenCalled();
	expect(args.Some.mock.calls).toEqual([]);
});

test("Option.match Some callback returns value", () => {
	const result = Option.match(Some(10), {
		Some: (res) => res + 1,
		None: () => 0,
	});
	expect(result).toEqual(11);
});

test("Option.match None callback returns value", () => {
	const result = Option.match(None, {
		Some: (res) => res + 1,
		None: () => 0,
	});
	expect(result).toEqual(0);
});

test("Option.get returns Some value or falls back to default value", () => {
	const result = Some(100);
	const val = Option.get(result, 0);
	expect(val).toBe(100);
});

test("Option.get returns default value if a is None", () => {
	const result = None;
	const val = Option.get(result, 0);
	expect(val).toBe(0);
});

test("Option.getExn returns the value of Some", () => {
	const result = Some(100);
	const val = Option.getExn(result);
	expect(val).toBe(100);
});

test("Option.getExn throws if result is of type None", () => {
	const result = None;
	const callBadMatch = () => Option.getExn(result);
	expect(callBadMatch).toThrow("OptionGetError");
});

test("Option.map returns None if option is None", () => {
	const opt = None;
	const val = Option.map((x) => x + 1, opt);
	expect(val).toBe(None);
});

test("Option.map returns the application of fn(a) if option is Some(a)", () => {
	const opt = Some(10);
	const val = Option.map((x) => x + 1, opt);
	expect(val).toBe(11);
});

test("Option.map can be partially applied", () => {
	const add1 = Option.map((x: number) => x + 1);
	const val = add1(Some(10));
	expect(val).toBe(11);
});

test("Option.bind flattens nested options", () => {
	const isEven = (x: number): Option.t<number> =>
		x % 2 === 0 ? Some(x) : None;

	const val = Option.bind(isEven, Some(2));
	expect(val).toBe(Some(2));
});

test("Option.bind works when chaining", () => {
	const isEven = (x: number): Option.t<number> =>
		x % 2 === 0 ? Some(x) : None;

	const val = Option.bind(isEven, Option.bind(isEven, Some(2)));
	expect(val).toBe(Some(2));
});

test("Option.bind works with None case", () => {
	const isEven = (x: number): Option.t<number> =>
		x % 2 === 0 ? Some(x) : None;

	const val = Option.bind(isEven, Some(1));
	expect(val).toBe(None);
});

test("Option.bind passes None through when chaining", () => {
	const isEven = (x: number): Option.t<number> =>
		x % 2 === 0 ? Some(x) : None;

	const val = Option.bind(isEven, Option.bind(isEven, None));
	expect(val).toBe(None);
});
