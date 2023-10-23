import { expect, test } from "bun:test";
import * as Dynamic from "./index";

test("Dynamic.assertString returns value when it's a string", () => {
	const result = Dynamic.assertString("foo");
	expect(result).toEqual("foo");
});

test("Dynamic.assertString throws error when value is not a string", () => {
	const makeError = () => Dynamic.assertString(100);
	expect(makeError).toThrow("DynamicAssertError: Expected type string");
});

test("Dynamic.assertNumber returns value when it's a number", () => {
	const result = Dynamic.assertNumber(22);
	expect(result).toEqual(22);
});

test("Dynamic.assertNumber throws error when value is not a number", () => {
	const makeError = () => Dynamic.assertNumber("100");
	expect(makeError).toThrow("DynamicAssertError: Expected type number");
});

test("Dynamic.assertBool returns value when it's a bool", () => {
	const result = Dynamic.assertBool(false);
	expect(result).toEqual(false);
});

test("Dynamic.assertBool throws error when value is not a bool", () => {
	const makeError = () => Dynamic.assertBool("true");
	expect(makeError).toThrow("DynamicAssertError: Expected type bool");
});

test("Dynamic.assertNone returns value when it's null", () => {
	const result = Dynamic.assertNone(null);
	expect(result).toEqual(null);
});

test("Dynamic.assertNone throws error when value is not null", () => {
	const makeError = () => Dynamic.assertNone(23);
	expect(makeError).toThrow("DynamicAssertError: Expected type None");
});

test("Dynamic.assertRecord returns value when types match", () => {
	type Foo = { id: number; name: string };
	const data = { id: 1, name: "foo" };
	const result = Dynamic.assertRecord<Foo>(
		[Dynamic.field("id", "number"), Dynamic.field("name", "string")],
		data,
	);
	expect(result).toEqual(data);
});

test("Dynamic.assertRecord throws assert error when type fails", () => {
	type Foo = { id: number; name: string };
	const data = { id: "10", name: "foo" } as any;
	const makeError = () =>
		Dynamic.assertRecord<Foo>(
			[Dynamic.field("id", "number"), Dynamic.field("name", "string")],
			data,
		);
	expect(makeError).toThrow("DynamicAssertError: Expected type number");
});
