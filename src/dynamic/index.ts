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
