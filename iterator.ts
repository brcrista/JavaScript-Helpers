/** Join zero or more iterables into a single iterable. */
function* chain<T>(...iterables: Array<Iterable<T>>) {
    for (const it of iterables) {
        yield* it;
    }
}
