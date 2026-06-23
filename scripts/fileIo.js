/**
 * Wraps the File System Access API for opening and saving text files.
 * Tracks the currently open file handle so Save can write back to it.
 */

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