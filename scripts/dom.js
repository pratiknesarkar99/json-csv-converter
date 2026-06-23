// Element references
export const inputBox = document.getElementById("input-box");
export const outputBox = document.getElementById("output-box");
export const toCsvBtn = document.getElementById("to-csv-btn");
export const toJsonBtn = document.getElementById("to-json-btn");
export const clearBtn = document.getElementById("clear-btn");
export const warningEl = document.getElementById("warning");
export const openCsvBtn = document.getElementById("open-csv-btn");
export const saveCsvBtn = document.getElementById("save-csv-btn");
export const openJsonBtn = document.getElementById("open-json-btn");
export const fileStatusEl = document.getElementById("file-status");

/**
 * Updates the small filename indicator next to the file action buttons.
 * @param {string} name - filename to display, or "" to clear
 */
export function setFileStatus(name) {
    fileStatusEl.textContent = name ? `Loaded: ${name}` : "";
}

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