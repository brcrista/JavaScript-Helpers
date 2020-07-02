'use strict';
const random = require('../dist/random');

describe('random.shuffle', () => {
    // `test.each` interprets its argument as a 2-D table of arguments,
    // so use `...` to turn the arguments back into an array.
    test.each([[], [0], [1, 2, 3, 4]])('returns a result with the same number of elements as the input (%p)', (...array) => {
        const shuffled = random.shuffle(array);
        expect(Array.from(shuffled).length).toBe(array.length);
    });

    test('does not mutate the input', () => {
        const array = [1, 2, 3, 4];
        // Use `Array.from` to make sure we've traversed the iterator.
        Array.from(random.shuffle(array));
        expect(array).toEqual([1, 2, 3, 4]);
    });
});