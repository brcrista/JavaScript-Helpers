/**
 * Check whether an object implements the iterable protocol.
 * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Iteration_protocols.
 */
export function isIterable(obj: any): boolean {
    return obj !== undefined
        && obj !== null
        && typeof obj[Symbol.iterator] === 'function';
}

/** Join zero or more iterables into a single iterable. */
export function* concat<T>(...iterables: Array<Iterable<T>>): Generator<T, void, undefined> {
    for (const it of iterables) {
        yield* it;
    }
}

/**
 * Produce an array of `n` items from a `sequencer` function.
 * The `sequencer` function will be passed the index of each element being generated.
 */
export function* sequence<T>(n: number, sequencer: (i: number) => T) {
    for (let i = 0; i < n; i++) {
        yield sequencer(i);
    }
}

/**
 * Generate a sequence of integers for the half-open set `[min, max)` by increments of `step`.
 * @param {number} min - Lower bound (inclusive) of the range.
 * @param {number} max - Upper bound (exclusive) of the range.
 * @param {number} step - Must be positive. Default = 1.
 * @returns If `min` >= `max` (after rounding), an empty array is returned.
 */
export function* range(min: number, max: number, step?: number): Generator<number, void> {
    step = step ?? 1;
    if (step <= 0) {
        throw new RangeError('Invalid step size');
    }

    let value = min;
    while (value < max) {
        yield value;
        value += step;
    }
}

/**
 * Generate the Cartesian product of a pair of iterables.
 */
export function* product<A, B>(as: Iterable<A>, bs: Iterable<B>): Generator<[A, B], void> {
    for (const a of as) {
        for (const b of bs) {
            yield [a, b];
        }
    }
}

/**
 * Pair each element of a sequence with its index starting from `0`.
 */
export function* enumerate<T>(iterable: Iterable<T>): Generator<[number, T], void> {
    let count = 0;
    for (const item of iterable) {
        yield [count++, item];
    }
}

/**
 * Invoke a callback function on each element of an iterable and generate a new iterable with the result.
 * @param callback - A function that is called on each element in the iterable. It may optionally take the current index of the element. The function is called lazily as the result is iterated.
 * @param thisArg - An object which the `this` keyword refers to in `callback`. If `thisArg` is omitted, `this` will be `undefined`.
 */
export function* map<T, U>(iterable: Iterable<T>, callback: (value: T, index: number) => U, thisArg?: any): Generator<U, void> {
    for (const item of enumerate(iterable)) {
        yield callback.call(thisArg, item[1], item[0]);
    }
}

/**
 * Return the elements of an iterable for which a callback function is truthy.
 * @param callback - A predicate that is called on each element in the iterable. It may optionally take the current index of the element. The function is called lazily as the result is iterated.
 * @param thisArg - An object which the `this` keyword refers to in `callback`. If `thisArg` is omitted, `this` will be `undefined`.
 */
export function* filter<T>(iterable: Iterable<T>, callback: (value: T, index: number) => unknown, thisArg?: any): Generator<T, void> {
    for (const item of enumerate(iterable)) {
        if (callback.call(thisArg, item[1], item[0])) {
            yield item[1];
        }
    }
}