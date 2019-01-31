/** Combine multiple `Iterable`s into a single `Iterable`. */
function* chain(...iterables: Iterable<any>[]): Iterable<any> {
    for (const iterable of iterables) {
        yield* iterable;
    }
}