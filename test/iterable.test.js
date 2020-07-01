const iterable = require('../dist/iterable');

expect.extend({
    toBeEmptyIterable(received) {
        if (!iterable.isIterable(received)) {
            return {
                message: () => `${received} is not iterable`,
                pass: false
            };
        }

        const iterator = received[Symbol.iterator]();
        const next = iterator.next();
        if (!next.done) {
            return {
                message: () => `${received} is iterable, but it is not empty. First value: ${next.value}`,
                pass: false
            };
        }

        return {
            pass: true
        };
    },

    toYield(received, ...expectedValues) {
        if (!iterable.isIterable(received)) {
            return {
                message: () => `${received} is not iterable`,
                pass: false
            };
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
            if (actual[i] !== expectedValues[i]) {
                return {
                    message: () => `${actual} and ${expectedValues} differ at index ${i} (${actual[i]} !== ${expectedValues[i]})`,
                    pass: false
                };
            }
        }

        return {
            pass: true
        };
    }
});

// Note that if this fails, the other test results aren't reliable.
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
        expect(iterable.chain()).toBeEmptyIterable();
    });

    test('passes through a single argument', () => {
        expect(iterable.chain([1, 2])).toYield(1, 2);
    });

    test('chains multiple arguments', () => {
        expect(iterable.chain([1, 2], (function* () { yield 3; yield 4; })(), [5])).toYield(1, 2, 3, 4, 5);
    });
});

describe('iterable.range', () => {
    test('returns an empty iterable for an empty range', () => {
        expect(iterable.range(1, 0)).toBeEmptyIterable();
        expect(iterable.range(0, 0)).toBeEmptyIterable();
    });

    test('returns a range of nonzero size', () => {
        expect(iterable.range(0, 1)).toYield(0);
        expect(iterable.range(0, 5)).toYield(0, 1, 2, 3, 4);
        expect(iterable.range(3, 6)).toYield(3, 4, 5);
        expect(iterable.range(-2, 0)).toYield(-2, -1);
    });
});