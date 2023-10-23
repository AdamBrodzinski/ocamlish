type None = null;

export class DynamicAssertError extends Error {
	name = "DynamicAssertError";
	constructor(expectedType: string) {
		super(`DynamicAssertError: Expected type ${expectedType}`);
		Object.setPrototypeOf(this, DynamicAssertError.prototype);
	}
}

export function assertString(x: any): string {
	if (typeof x !== "string") {
		throw new DynamicAssertError("string");
	}
	return x;
}

export function assertNumber(x: any): number {
	if (typeof x !== "number") {
		throw new DynamicAssertError("number");
	}
	return x;
}

export function assertBool(x: any): boolean {
	if (typeof x !== "boolean") {
		throw new DynamicAssertError("bool");
	}
	return x;
}

export function assertNone(x: any): None {
	if (x !== null) {
		throw new DynamicAssertError("None");
	}
	return x;
}

export function assertRecord<T extends unknown>(
	fields: Field<T>[],
	obj: any,
): T {
	for (let i = 0; i < fields.length; i++) {
		const [key, type] = fields[i];

		if (type === "string") {
			assertString(obj[key]);
		} else if (type === "number") {
			assertNumber(obj[key]);
		}
	}
	return obj;
}

type Field<T> = [key: keyof T, type: "string" | "number" | "boolean"];

export function field<T>(key: keyof T, type: "string" | "number" | "boolean") {
	return [key, type] as Field<T>;
}
