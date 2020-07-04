import { remove } from './index';
import { sequence } from './iterable';

/** Randomly choose an integer in the range [`0`, `size`) with a uniform distribution. */
export function randomInt(size: number): number {
    return Math.floor(Math.random() * size);
}

/** Select an element at random from an array. */
export function choice<T>(array: Array<T>): T {
    return array[randomInt(array.length)];
}

/** Select and remove an element at random from an array. */
export function pick<T>(array: Array<T>): T {
    return remove(array, randomInt(array.length));
}

/** Create a random permutation of an iterable. */
export function shuffle<T>(iterable: Iterable<T>): Generator<T, void> {
    const array = Array.from(iterable);
    return sequence(array.length, () => pick(array));
}