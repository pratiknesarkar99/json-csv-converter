/**
 * Validates and parses a JSON string.
 * Returns the parsed value if valid, or null if invalid/empty.
 *
 * @param {string} str - raw text from the JSON textarea
 * @returns {*} parsed JSON value, or null if invalid or empty
 */
export function isValidJson(str) {
    if (!str || str.trim() === "") {
        return null;
    }

    try {
        return JSON.parse(str);
    } catch (e) {
        return null;
    }
}