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

    // test('returns an empty iterable when nothing is chained', () => {
    //     expect(iterable.chain()).toYield([]);
    // });

    test('passes through a single argument', () => {
        expect(iterable.chain([1, 2])).toYield(1, 2);
    });

    // test('passes through a single argument', () => {
    //     expect(iterable.chain([1, 2, 3])).toYield(1, 2);
    // });

    // test('passes through a single argument', () => {
    //     expect(iterable.chain([1, 2, 3])).toYield(1, 3, 3);
    // });

    // test('passes through a single argument', () => {
    //     expect(iterable.chain([1, 2])).toYield(1, 3, 3);
    // });

    // test('passes through a single argument', () => {
    //     expect(iterable.chain([1, 2])).toYield();
    // });
});