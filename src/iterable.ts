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
 * @param callback - A function that is called on each element in the iterable.
 * It may optionally take the current index of the element.
 * The function is called lazily as the result is iterated.
 * @param thisArg - An object which the `this` keyword refers to in `callback`.
 * If `thisArg` is omitted, `this` will be `undefined`.
 */
export function* map<T, U>(iterable: Iterable<T>, callback: (value: T, index: number) => U, thisArg?: any): Generator<U, void> {
    for (const item of enumerate(iterable)) {
        yield callback.call(thisArg, item[1], item[0]);
    }
}

/**
 * Return the elements of an iterable for which a callback function is truthy.
 * @param predicate - A function that is called on each element in the iterable. It may optionally take the current index of the element.
 * The function is called lazily as the result is iterated.
 * @param thisArg - An object which the `this` keyword refers to in `callback`. If `thisArg` is omitted, `this` will be `undefined`.
 */
export function* filter<T>(iterable: Iterable<T>, predicate: (value: T, index: number) => unknown, thisArg?: any): Generator<T, void> {
    for (const item of enumerate(iterable)) {
        if (predicate.call(thisArg, item[1], item[0])) {
            yield item[1];
        }
    }
}

/**
 * Converts an iterable to a single value by using an accumulator function.
 * @param accumulator A function that is called on each element in the iterable along with the previous result of the function.
 * It may optionally take the current index of the element.
 * @param initialValue If specified, used as the initial value for `accumulated`.
 * If not specified, the first element from the iterable will be used as the initial `accumulated` value and the accumulation will start on the second element.
 * Calling `reduce` on an empty iterable without an initial value will throw a `TypeError`.
 */
export function reduce<T>(iterable: Iterable<T>, accumulator: (accumulated: T, current: T, index: number) => T, initialValue?: T): T {
    if (initialValue === undefined) {
        // Use the first element as the initial value.
        const iterator = iterable[Symbol.iterator]();
        let currentElement = iterator.next();
        if (currentElement.done) {
            throw new TypeError('Reduce of empty iterable with no initial value');
        }

        let accumulated = currentElement.value;
        // Start the accumulation on the second element.
        currentElement = iterator.next();
        for (let i = 1; !currentElement.done; i++, currentElement = iterator.next()) {
            accumulated = accumulator(accumulated, currentElement.value, i);
        }
        return accumulated;
    } else {
        let accumulated = initialValue;
        for (const item of enumerate(iterable)) {
            accumulated = accumulator(accumulated, item[1], item[0]);
        }
        return accumulated;
    }
}

// NOTE: `Array.prototype.reduce` should actually be sufficient for most cases,
// and `reduce` needs to iterate over the whole iterable anyway.
// So, I'm not going to bother to implement the special cases of `reduce` (`some`, `every`, etc.).
// The iterable version of `reduce` may be useful to avoid loading the entire collection into memory at once.

/** Return the first element of an iterable, or `undefined` if it is empty. */
export function shift<T>(iterable: Iterable<T>): T | undefined {
    const iterator = iterable[Symbol.iterator]();
    return iterator.next().value;
}

/** Return the first `n` elements of an iterable. */
export function* take<T>(n: number, iterable: Iterable<T>): Generator<T, void> {
    // If you use for..of, you can't call `take` multiple times on the same iterator
    // if it is an iterable iterator such as a generator.
    const iterator = iterable[Symbol.iterator]();
    for (let i = 0; i < n; i++) {
        // This part is tricky.
        // If you `next` it, you have to `yield` it
        // or else you will get an off-by-one error on subsequent calls
        // when the iterator isn't done yet.
        // Therefore, we have to check `current.done` inside the loop
        // and not in the `for` condition.
        const current = iterator.next();
        if (current.done)
        {
            break;
        }

        yield current.value;
    }
}

/** Returns the elements after the first `n` elements of an iterable. */
export function* skip<T>(n: number, iterable: Iterable<T>): Generator<T, void> {
    let i = 0;
    for (const item of iterable) {
        if (i >= n) {
            yield item;
        } else {
            // Put this in an `else` so `i` doesn't overflow.
            i++;
        }
    }
}

/**
 * Returns the elements between the indices `start` and `end` of an iterable.
 * @param {number} start - The zero-based index at which to start the slice (inclusive).
 * Unlike `Array.prototype.slice`, a negative `start` does not indicate an offset from the end of the iterable.
 * @param {number} end - The zero-based index at which to end the slice (exclusive).
 */
export function slice<T>(iterable: Iterable<T>, start: number, end?: number): Generator<T, void> {
    if (end === undefined) {
        return skip(start, iterable);
    } else {
        // Do some rounding to match the behavior of `Array.prototype.slice`
        // when the inputs aren't nonnegative integers.
        start = Math.max(Math.floor(start), 0);
        end = Math.floor(end);
        const sizeOfSlice = end - start;
        return take(sizeOfSlice, skip(start, iterable));
    }
}

/**
 * Produce an iterable of `n` items from a `sequencer` function.
 * @param sequencer - A function that will be passed the index of each element being generated.
 */
export function* sequence<T>(n: number, sequencer: (i: number) => T) {
    for (let i = 0; i < n; i++) {
        yield sequencer(i);
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