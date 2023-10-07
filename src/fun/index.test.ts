import { expect, test } from "bun:test";
import { Fun } from "../index";

const add1 = (x: number) => x + 1;
const subtract = (a: number, b: number) => a - b;
const uppercase = (x: string) => x.toUpperCase();
const prepend = (pre: string) => (x: number | string) => `${pre}${x}`;

test("Fun.identity returns the value passed in", () => {
   const arg = { foo: 1 };
   const result = Fun.identity(arg);
   expect(result === arg).toBeTrue();
});

test("Fun.pipe chains multiple function calls together", () => {
   const val = Fun.pipe(2)
      .chain(add1)
      .chain((x: number) => x * 3)
      .unwrap();

   expect(val).toBe(9);
});

test("Fun.pipe functions can return different types", () => {
   const val: string = Fun.pipe(2.3)
      .chain(add1)
      .chain(Math.round)
      .chain(prepend("total: "))
      .chain(uppercase)
      .unwrap();

   expect(val).toBe("TOTAL: 3");
});

test("Fun.pipe works without chain", () => {
   const val = Fun.pipe(2).unwrap();
   expect(val).toBe(2);
});

test("Fun.flip reverses the order of arguments", () => {
   const sub = subtract(10, 5);
   const flippedSub = Fun.flip(subtract)(10, 5);
   expect(sub).toBe(5);
   expect(flippedSub).toBe(-5);
});

test("Fun.negate will negate the result of a predicate", () => {
   const isEven = (x: number) => x % 2 === 0;
   const isOdd = Fun.negate(isEven);

   expect(isEven(2)).toEqual(true);
   expect(isOdd(2)).toEqual(false);
});
