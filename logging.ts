const log = {
    info: message => console.log(`[INFO] ${message}`),
    warning: message => console.log(`[WARNING] ${message}`),
    error: message => console.error(`[ERROR] ${message}`)
};

/** Log `label: ${value}` and pass the value through. */
function trace(label, value) {
    log.info(`${label}: ${value}`);
    return value;
}