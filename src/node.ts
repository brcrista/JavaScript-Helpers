import * as http from 'http';
import * as URL from 'url';

/**
 * Call a URL and return the response's status code.
 * @param {URL.Url} url - URL to call for a status code
 * @returns {Promise} - the HTTP response message
 */
export function fetch(url: URL.Url): Promise<http.IncomingMessage> {
    return new Promise((resolve, reject) => {
        http.get(url, (res) => {
            try {
                resolve(res);
            } catch (error) {
                reject(error);
            }
        });
    });
}