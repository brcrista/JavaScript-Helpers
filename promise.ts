/** Return a promise that will resolve after the given period of time. */
export function sleep(milliseconds: number): Promise<void> {
    return new Promise<void>(resolve => {
        setTimeout(resolve, milliseconds);
    });
}