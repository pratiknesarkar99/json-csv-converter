/**
 * Wraps the File System Access API for opening and saving text files.
 * Tracks the currently open file handle so Save can write back to it.
 */

/**
 * Saves text content to a file. If a file handle is already open (from Open
 * or a previous Save), writes directly to it. Otherwise prompts a save picker
 * and tracks the resulting handle for subsequent saves.
 *
 * @param {string} content - text content to write
 * @param {Array<string>} extensions - e.g. [".csv"] for the save picker filter
 * @param {string} suggestedName - default filename if no handle exists yet
 * @returns {Promise<string|null>} the saved filename, or null if user cancelled
 * @throws {Error} if unsupported or the write fails
 */
export async function saveFile(content, extensions, suggestedName) {
    if (!isFileSystemAccessSupported()) {
        throw new Error(
            "Your browser doesn't support file saving. Try Chrome or Edge."
        );
    }

    let handle = currentFileHandle;

    if (!handle) {
        try {
            handle = await window.showSaveFilePicker({
                suggestedName,
                types: [
                    {
                        description: "Text files",
                        accept: { "text/plain": extensions },
                    },
                ],
            });
        } catch (e) {
            if (e.name === "AbortError") return null;
            throw new Error("Could not open the save picker.");
        }
        currentFileHandle = handle;
    }

    try {
        const writable = await handle.createWritable();
        await writable.write(content);
        await writable.close();
        return handle.name;
    } catch (e) {
        throw new Error("Failed to save the file.");
    }
}

let currentFileHandle = null;

/**
 * Returns true if the browser supports the File System Access API.
 */
export function isFileSystemAccessSupported() {
    return "showOpenFilePicker" in window;
}

/**
 * Opens a file picker, reads the selected file as text, and stores its handle.
 *
 * @param {Array<string>} extensions - e.g. [".csv"] for the picker filter
 * @returns {Promise<{ name: string, content: string }>}
 * @throws {Error} if unsupported, cancelled, or read fails
 */
export async function openFile(extensions) {
    if (!isFileSystemAccessSupported()) {
        throw new Error(
            "Your browser doesn't support file opening. Try Chrome or Edge."
        );
    }

    let handles;
    try {
        handles = await window.showOpenFilePicker({
            types: [
                {
                    description: "Text files",
                    accept: { "text/plain": extensions },
                },
            ],
        });
    } catch (e) {
        // AbortError = user cancelled the picker, not a real error
        if (e.name === "AbortError") return null;
        throw new Error("Could not open the file picker.");
    }

    const [handle] = handles;

    try {
        const file = await handle.getFile();
        const content = await file.text();
        currentFileHandle = handle;
        return { name: file.name, content };
    } catch (e) {
        throw new Error("Failed to read the selected file.");
    }
}

/**
 * Returns the currently tracked file handle, or null if none is open.
 */
export function getCurrentFileHandle() {
    return currentFileHandle;
}

/**
 * Clears the tracked file handle (e.g. on Clear button).
 */
export function clearCurrentFileHandle() {
    currentFileHandle = null;
}