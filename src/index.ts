// This is the top-level file for the package.
// Add anything you want exported from the package here.

import * as iterable_ from './iterable';
import * as logging_ from './logging';
import * as node_ from './node';
import * as random_ from './random';

export const iterable = iterable_;
export const logging = logging_;
export const node = node_;
export const random = random_;

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