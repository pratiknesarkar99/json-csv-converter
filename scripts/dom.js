// Element references
export const jsonInput = document.getElementById("json-input");
export const csvOutput = document.getElementById("csv-output");
export const convertBtn = document.getElementById("convert-btn");
export const clearBtn = document.getElementById("clear-btn");
export const warningEl = document.getElementById("warning");

/**
 * Displays a warning message to the user.
 * @param {string} msg
 */
export function showWarning(msg) {
    warningEl.textContent = msg;
    warningEl.hidden = false;
}

/**
 * Clears any visible warning message.
 */
export function clearWarning() {
    warningEl.textContent = "";
    warningEl.hidden = true;
}