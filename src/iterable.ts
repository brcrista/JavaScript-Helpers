/**
 * Check whether an object implements the iterable protocol.
 * See https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Iteration_protocols.
 * Adapted from https://stackoverflow.com/a/32538867/3084634.
 */
export function isIterable(obj: any): boolean {
    return obj !== undefined
        && obj !== null
        && typeof obj[Symbol.iterator] === 'function';
}

/** Join zero or more iterables into a single iterable. */
export function* chain<T>(...iterables: Array<Iterable<T>>): Generator<T, void, undefined> {
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
 * Generate a sequence of integers for the half-open set `[min, max)`.
 * If `min` is not an integer, it is rounded up.
 * If `max` is not an integer, it is rounded down.
 * If `min` >= `max` (after rounding), an empty array is returned.
 */
export function range(min: number, max: number): Generator<number, void> {
    min = Math.ceil(min);
    max = Math.floor(max);

    const sizeOfRange = Math.max(0, max - min);
    return sequence(sizeOfRange, n => n + min);
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
 * Call a callback function on each element of an iterable and generate a new iterable with the result.
 */
export function* map<T, U>(callbackfn: (value: T, index: number) => U, iterable: Iterable<T>): Generator<U, void> {
    // TODO delegate when Array.isArray(iterable)
    for (const item of enumerate(iterable)) {
        yield callbackfn(item[1], item[0]);
    }
}