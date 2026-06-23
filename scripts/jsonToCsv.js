/**
 * Converts an array of flat JSON objects into a CSV string.
 * Assumes all objects share the same keys (uses keys from the first object as headers).
 * No nested object/array support (by design, per project constraints).
 *
 * @param {Array<Object>} data - Array of flat JSON objects
 * @returns {string} CSV string (headers + rows, comma separated, newline delimited)
 */
export function jsonToCsv(data) {
    if (!Array.isArray(data) || data.length === 0) {
        throw new Error("JSON must be a non-empty array of objects.");
    }

    const headers = Object.keys(data[0]);

    const rows = data.map((obj) =>
        headers.map((key) => formatField(obj[key])).join(",")
    );

    return [headers.join(","), ...rows].join("\n");
}

/**
 * Formats a single field for CSV output.
 * Wraps in quotes if the value contains a comma, quote, or newline.
 */
function formatField(value) {
    if (value === undefined || value === null) return "";

    const str = String(value);
    const needsQuoting = /[",\n]/.test(str);

    if (needsQuoting) {
        return `"${str.replace(/"/g, '""')}"`;
    }

    return str;
}