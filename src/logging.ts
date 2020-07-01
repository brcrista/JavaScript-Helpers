export interface Logger {
    info(message: string): void;
    warning(message: string): void;
    error(message: string): void;
}

export const trace: Logger = {
    info: (message: string) => console.log(`[INFO] ${message}`),
    warning: (message: string) => console.log(`[WARNING] ${message}`),
    error: (message: string) => console.error(`[ERROR] ${message}`)
};

/** Log `label: ${value}` and pass the value through. */
export function tee(label: any, value: any) {
    trace.info(`${label}: ${value}`);
    return value;
}