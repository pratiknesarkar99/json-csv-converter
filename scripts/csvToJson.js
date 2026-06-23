/**
 * Converts a CSV string into an array of flat JSON objects.
 * First row is treated as headers. Supports quoted fields containing
 * commas or newlines, and escaped quotes ("" inside a quoted field).
 * Nested structures are not supported (by design, per project constraints).
 *
 * @param {string} csv - raw CSV text
 * @returns {Array<Object>} array of objects keyed by header row
 * @throws {Error} if a data row's field count doesn't match the header row
 */
export function csvToJson(csv) {
    const rows = parseRows(csv);

    if (rows.length === 0) {
        throw new Error("CSV must contain at least a header row.");
    }

    const [headers, ...dataRows] = rows;

    return dataRows.map((row, i) => {
        if (row.length !== headers.length) {
            throw new Error(
                `Row ${i + 2} has ${row.length} field(s), expected ${headers.length}.`
            );
        }

        const obj = {};
        headers.forEach((header, idx) => {
            obj[header] = row[idx];
        });
        return obj;
    });
}

/**
 * Parses raw CSV text into an array of rows, each row an array of field strings.
 * Handles quoted fields (commas/newlines inside quotes) and escaped quotes ("").
 */
function parseRows(csv) {
    const rows = [];
    let row = [];
    let field = "";
    let inQuotes = false;

    for (let i = 0; i < csv.length; i++) {
        const char = csv[i];
        const next = csv[i + 1];

        if (inQuotes) {
            if (char === '"' && next === '"') {
                field += '"';
                i++; // skip the escaped quote pair
            } else if (char === '"') {
                inQuotes = false;
            } else {
                field += char;
            }
            continue;
        }

        if (char === '"') {
            inQuotes = true;
            continue;
        }

        if (char === ",") {
            row.push(field);
            field = "";
            continue;
        }

        if (char === "\n" || char === "\r") {
            // Handle \r\n by skipping the paired \n
            if (char === "\r" && next === "\n") i++;

            row.push(field);
            field = "";

            // Skip entirely blank trailing lines
            if (row.length > 1 || row[0] !== "") {
                rows.push(row);
            }
            row = [];
            continue;
        }

        field += char;
    }

    // Final field/row (no trailing newline)
    if (field !== "" || row.length > 0) {
        row.push(field);
        rows.push(row);
    }

    return rows;
}