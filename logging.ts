export const log = {
    info: (message: any) => console.log(`[INFO] ${message}`),
    warning: (message: any) => console.log(`[WARNING] ${message}`),
    error: (message: any) => console.error(`[ERROR] ${message}`)
};

/** Log `label: ${value}` and pass the value through. */
export function tee(label: any, value: any) {
    log.info(`${label}: ${value}`);
    return value;
}