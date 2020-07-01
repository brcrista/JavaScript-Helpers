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

    // test('passes through a single argument', () => {
    //     expect(iterable.chain([1, 2])).toYield([1, 2]);
    // });
});