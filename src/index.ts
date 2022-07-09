/** Return a promise that will resolve after the given period of time. */
export function sleep(milliseconds: number): Promise<void> {
    return new Promise<void>(resolve => {
        setTimeout(resolve, milliseconds);
    });
}

/**
 * Remove the `i`th element from an array and return it.
 * In keeping with the `Array` prototype methods, this will not throw a `RangeError`
 * for indices outside the bounds of the array.
 */
export function remove<T>(array: T[], i: number): T {
    return array.splice(i, 1)[0];
}

/**
 * Produce a comparison function for use with `Array.prototype.sort()`.
 */
function compareBy<T>(sortKey: (t: T) => number): (a: T, b: T) => number {
    return (a: T, b: T) => {
        if (sortKey(a) < sortKey(b)) {
            return -1;
        } else if (sortKey(a) === sortKey(b)) {
            return 0;
        } else {
            return 1;
        }
    }
}

/** Lazily initializes a read-only value from a callback function. */
export class Lazy<T> {
    private _value: T | null = null;

    constructor(private readonly init: () => T) {}

    public get value() {
        if (!this._value) {
            this._value = this.init();
        }

        return this._value;
    }
}
