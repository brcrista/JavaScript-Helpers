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
