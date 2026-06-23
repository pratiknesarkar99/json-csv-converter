/**
 * Wraps the File System Access API for opening and saving text files.
 * Tracks separate file handles per type ("csv" / "json") so opening one
 * doesn't clobber the other when saving.
 */

const fileHandles = {
    csv: null,
    json: null,
};

/**
 * Returns true if the browser supports the File System Access API.
 */
export function isFileSystemAccessSupported() {
    return "showOpenFilePicker" in window;
}

/**
 * Opens a file picker, reads the selected file as text, and stores its
 * handle under the given type key.
 *
 * @param {"csv"|"json"} type - which handle slot to track this file under
 * @param {Array<string>} extensions - e.g. [".csv"] for the picker filter
 * @returns {Promise<{ name: string, content: string }|null>} null if cancelled
 * @throws {Error} if unsupported or read fails
 */
export async function openFile(type, extensions) {
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
        fileHandles[type] = handle;
        return { name: file.name, content };
    } catch (e) {
        throw new Error("Failed to read the selected file.");
    }
}

/**
 * Saves text content to a file under the given type key. If a handle is
 * already tracked for that type (from Open or a previous Save), writes
 * directly to it. Otherwise prompts a save picker and tracks the result.
 *
 * @param {"csv"|"json"} type - which handle slot to use/save
 * @param {string} content - text content to write
 * @param {Array<string>} extensions - e.g. [".csv"] for the save picker filter
 * @param {string} suggestedName - default filename if no handle exists yet
 * @returns {Promise<string|null>} the saved filename, or null if user cancelled
 * @throws {Error} if unsupported or the write fails
 */
export async function saveFile(type, content, extensions, suggestedName) {
    if (!isFileSystemAccessSupported()) {
        throw new Error(
            "Your browser doesn't support file saving. Try Chrome or Edge."
        );
    }

    let handle = fileHandles[type];

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
        fileHandles[type] = handle;
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

/**
 * Clears all tracked file handles (e.g. on Clear button).
 */
export function clearFileHandles() {
    fileHandles.csv = null;
    fileHandles.json = null;
}