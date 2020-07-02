'use strict';
const iterable = require('../dist/iterable');

expect.extend({
    toBeEmpty(received) {
        for (const item in received) {
            return {
                message: () => `${received} is iterable, but it is not empty. First value: ${item}`,
                pass: false
            };
        }

        return {
            pass: true
        };
    },

    toYield(received, expectedValues, elementsEqual) {
        if (elementsEqual === undefined) {
            elementsEqual = (a, b) => a === b;
        }

        const actual = Array.from(received);

        if (actual.length > expectedValues.length) {
            return {
                message: () => `${actual} has more elements (${actual.length}) than ${expectedValues} (${expectedValues.length})`,
                pass: false
            };
        } else if (actual.length < expectedValues.length) {
            return {
                message: () => `${actual} has fewer elements (${actual.length}) than ${expectedValues} (${expectedValues.length})`,
                pass: false
            };
        }

        // `actual` and `expectedValues` have the same length
        for (let i = 0; i < actual.length; i++) {
            if (!elementsEqual(actual[i], expectedValues[i])) {
                return {
                    message: () => `${actual} and ${expectedValues} differ at index ${i} (${actual[i]} != ${expectedValues[i]})`,
                    pass: false
                };
            }
        }

        return {
            pass: true
        };
    }
});

function pairsStrictEqual(lhs, rhs) {
    return lhs[0] === rhs[0]
        && lhs[1] === rhs[1];
}

describe('iterable.isIterable', () => {
    function* generatorFunction() {
        yield true;
    }

    const areIterable = [
        [],
        [0],
        [0, 1, 2],
        'hello',
        generatorFunction()
    ];

    test.each(areIterable)('is true for %p', (obj) => {
        expect(iterable.isIterable(obj)).toBe(true);
    });

    const notIterable = [
        1,
        { a: 1 },
        generatorFunction
    ];

    test.each(notIterable)('is false for %p', (obj) => {
        expect(iterable.isIterable(obj)).toBe(false);
    });
});

describe('iterable.concat', () => {
    test('returns an empty iterable when nothing is chained', () => {
        expect(iterable.concat()).toBeEmpty();
    });

    test('passes through a single argument', () => {
        expect(iterable.concat([1, 2])).toYield([1, 2]);
    });

    test('joins multiple arguments', () => {
        expect(iterable.concat([1, 2], (function* () { yield 3; yield 4; })(), [5])).toYield([1, 2, 3, 4, 5]);
    });
});

describe('iterable.range', () => {
    test('returns an empty iterable for an empty range', () => {
        expect(iterable.range(1, 0)).toBeEmpty();
        expect(iterable.range(0, 0)).toBeEmpty();
        expect(iterable.range(0, 0, 4)).toBeEmpty();
    });

    test('returns a range for integer bounds', () => {
        expect(iterable.range(0, 1)).toYield([0]);
        expect(iterable.range(0, 5)).toYield([0, 1, 2, 3, 4]);
        expect(iterable.range(3, 6)).toYield([3, 4, 5]);
        expect(iterable.range(-2, 0)).toYield([-2, -1]);
    });

    test('returns a range with a step size for integer bounds', () => {
        expect(iterable.range(0, 1, 3)).toYield([0]);
        expect(iterable.range(0, 5, 1)).toYield([0, 1, 2, 3, 4]);
        expect(iterable.range(3, 6, 2)).toYield([3, 5]);
    });

    test('rejects a nonpositive step size', () => {
        expect(() => [...iterable.range(0, 1, -1)]).toThrow(RangeError);
        expect(() => [...iterable.range(0, 5, 0)]).toThrow(RangeError);
    });

    test('returns a range for floating-point bounds', () => {
        // Checking equality with floats is bad, but using literals and adding integers should be predictable.
        // If this becomes flaky, pass an approximate equality function to `toYield`.
        expect(iterable.range(0.5, 3.6)).toYield([0.5, 1.5, 2.5, 3.5]);
    });
});

describe('iterable.product', () => {
    test('returns an empty iterable when one of the iterables is empty', () => {
        expect(iterable.product([], [])).toBeEmpty();
        expect(iterable.product(['a'], [])).toBeEmpty();
        expect(iterable.product([], ['a'])).toBeEmpty();
    });

    test('returns all permutations of nonempty iterables', () => {
        expect(iterable.product(['a', 'b', 'c'], [1, 2])).toYield([
            ['a', 1], ['a', 2],
            ['b', 1], ['b', 2],
            ['c', 1], ['c', 2]
        ], pairsStrictEqual);
    });
});

describe('iterable.enumerate', () => {
    test('returns an empty iterable when passed an empty iterable', () => {
        expect(iterable.enumerate([])).toBeEmpty();
    });

    test('enumerates a nonempty iterable', () => {
        expect(iterable.enumerate(['a', 'b', 'c'])).toYield([
            [0, 'a'], [1, 'b'], [2, 'c']
        ], pairsStrictEqual);
    });
});

describe('iterable.map', () => {
    test('returns an empty iterable when passed an empty iterable', () => {
        expect(iterable.map(x => x, [])).toBeEmpty();
    });

    test('invokes a function on a nonempty iterable', () => {
        expect(iterable.map(x => 2 * x, [1, 2, 3])).toYield([2, 4, 6]);
    });
});