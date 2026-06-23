// Element references
export const inputBox = document.getElementById("input-box");
export const outputBox = document.getElementById("output-box");
export const toCsvBtn = document.getElementById("to-csv-btn");
export const toJsonBtn = document.getElementById("to-json-btn");
export const clearBtn = document.getElementById("clear-btn");
export const warningEl = document.getElementById("warning");
export const openBtn = document.getElementById("open-btn");
export const saveBtn = document.getElementById("save-btn");
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