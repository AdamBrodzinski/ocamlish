export function pipe<A>(val: A) {
	return {
		chain: <B>(fn: (cbVal: A) => B) => pipe(fn(val)),
		unwrap: () => val,
	};
}

export function identity<T>(x: T) {
	return x;
}

export function flip<F extends (...args: any[]) => any>(
	fn: F,
): (...args: Parameters<F>) => ReturnType<F> {
	return function(...args: Parameters<F>): ReturnType<F> {
		return fn(...args.reverse());
	};
}

export function negate<A>(fn: (a: A) => boolean) {
	return function(a: A) {
		return !fn(a);
	};
}
