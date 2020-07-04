'use strict';
const index = require('../dist/index');

describe('index.sleep', () => {
    test.each([-1, 0, 100])('resolves when milliseconds = %i', async (ms) => {
        await index.sleep(ms);
    });
});

describe('index.Lazy', () => {
    test('initializes the value from the callback, lazily, at most once', () => {
        let numCalls = 0;
        const lazy = new index.Lazy(() => {
            numCalls++;
            return 'hello';
        });

        expect(numCalls).toBe(0);
        expect(lazy.value).toBe('hello');
        expect(numCalls).toBe(1);
        expect(lazy.value).toBe('hello');
        expect(numCalls).toBe(1);
    });
});

describe('index.remove', () => {
    test('removes an element within the bounds of the array', () => {
        const array = [1, 2, 3, 4];
        expect(index.remove(array, 2)).toBe(3);
        expect(array).toEqual([1, 2, 4]);
    });
});