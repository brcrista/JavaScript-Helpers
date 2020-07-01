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
 * Generate an iterable of integers from `min` to `max` (inclusive).
 * If `min` is not an integer, it is rounded up.
 * If `max` is not an integer, it is rounded down.
 * If `min` > `max` (after rounding if `min` or `max` is not an integer), an empty array is returned.
 */
export function range(min: number, max: number) {
    min = Math.ceil(min);
    max = Math.floor(max);

    const sizeOfRange = Math.max(0, max - min + 1);
    return sequence(sizeOfRange, n => n + min);
}

/** Remove the `i`th element from an array and return it. */
export function remove<T>(array: T[], i: number): T {
    if (!(i in range(0, array.length - 1))) {
        throw new RangeError(`${i} is not in the range [0, ${array.length})`);
    }

    return array.splice(i, 1)[0];
}

/** Randomly choose an integer in the range [`0`, `size`) with a uniform distribution. */
export function random(size: number): number {
    return Math.floor(Math.random() * size);
}

/** Create a random permutation of an iterable. */
export function shuffle<T>(iterable: Iterable<T>) {
    const arrayCopy = Array.from(iterable);
    return sequence(arrayCopy.length, () => remove(arrayCopy, random(arrayCopy.length)));
}