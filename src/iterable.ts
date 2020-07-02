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
export function range(min: number, max: number) {
    min = Math.ceil(min);
    max = Math.floor(max);

    const sizeOfRange = Math.max(0, max - min);
    return sequence(sizeOfRange, n => n + min);
}

/**
 * Generate the Cartesian product of a pair of iterables.
 */
export function* product<A, B>(as: Iterable<A>, bs: Iterable<B>): Generator<[A, B], void, undefined> {
    for (const a of as) {
        for (const b of bs) {
            yield [a, b];
        }
    }
}