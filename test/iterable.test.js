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

describe('iterable.chain', () => {
    test('returns an empty iterable when nothing is chained', () => {
        expect(iterable.chain()).toBeEmpty();
    });

    test('passes through a single argument', () => {
        expect(iterable.chain([1, 2])).toYield([1, 2]);
    });

    test('chains multiple arguments', () => {
        expect(iterable.chain([1, 2], (function* () { yield 3; yield 4; })(), [5])).toYield([1, 2, 3, 4, 5]);
    });
});

describe('iterable.range', () => {
    test('returns an empty iterable for an empty range', () => {
        expect(iterable.range(1, 0)).toBeEmpty();
        expect(iterable.range(0, 0)).toBeEmpty();
    });

    test('returns a range of nonzero size', () => {
        expect(iterable.range(0, 1)).toYield([0]);
        expect(iterable.range(0, 5)).toYield([0, 1, 2, 3, 4]);
        expect(iterable.range(3, 6)).toYield([3, 4, 5]);
        expect(iterable.range(-2, 0)).toYield([-2, -1]);
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