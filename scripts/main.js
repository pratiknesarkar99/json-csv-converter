import { jsonToCsv } from "./jsonToCsv.js";
import { csvToJson } from "./csvToJson.js";
import { isValidJson } from "./validators.js";
import { openFile, saveFile, registerHandle, clearFileHandles } from "./fileIO.js";
import {
    inputBox,
    outputBox,
    toCsvBtn,
    toJsonBtn,
    clearBtn,
    openBtn,
    saveBtn,
    showWarning,
    clearWarning,
    setFileStatus,
} from "./dom.js";

// Tracks which format ("csv" or "json") the user last worked with, set by
// opening a file or running a conversion. Save uses this to know which
// extension/file-handle to write to, since there's no longer a dedicated
// Save CSV / Save JSON button to make that explicit.
let activeFileType = null;

/**
 * Detects file type from a filename's extension.
 * @returns {"csv"|"json"|null}
 */
function detectTypeFromName(name) {
    const lower = name.toLowerCase();
    if (lower.endsWith(".csv")) return "csv";
    if (lower.endsWith(".json")) return "json";
    return null;
}

toCsvBtn.addEventListener("click", () => {
    clearWarning();

    const rawInput = inputBox.value;

    if (rawInput.trim() === "") {
        showWarning("Input is empty. Please paste some JSON first.");
        outputBox.value = "";
        return;
    }

    const parsed = isValidJson(rawInput);

    if (parsed === null) {
        showWarning("Please enter valid JSON.");
        outputBox.value = "";
        return;
    }

    // A single object (not already an array) is common for real-world API
    // responses. Wrap it so the user doesn't have to manually add brackets.
    const data = Array.isArray(parsed) ? parsed : [parsed];

    try {
        outputBox.value = jsonToCsv(data);
        activeFileType = "csv";
    } catch (e) {
        showWarning(e.message);
        outputBox.value = "";
    }
});

toJsonBtn.addEventListener("click", () => {
    clearWarning();

    const rawInput = inputBox.value;

    if (rawInput.trim() === "") {
        showWarning("Input is empty. Please paste some CSV first.");
        outputBox.value = "";
        return;
    }

    try {
        const result = csvToJson(rawInput);
        outputBox.value = JSON.stringify(result, null, 2);
        activeFileType = "json";
    } catch (e) {
        showWarning(e.message);
        outputBox.value = "";
    }
});

openBtn.addEventListener("click", async () => {
    clearWarning();

    try {
        const result = await openFile([".csv", ".json"]);
        if (result === null) return; // user cancelled picker

        const type = detectTypeFromName(result.name);

        if (type === null) {
            showWarning("Please choose a .csv or .json file.");
            return;
        }

        inputBox.value = result.content;
        activeFileType = type;
        registerHandle(type, result.handle);
        setFileStatus(result.name);
    } catch (e) {
        showWarning(e.message);
    }
});

saveBtn.addEventListener("click", async () => {
    clearWarning();

    const content = outputBox.value.trim() !== "" ? outputBox.value : inputBox.value;

    if (content.trim() === "") {
        showWarning("Nothing to save. Convert or open a file first.");
        return;
    }

    if (activeFileType === null) {
        showWarning("Convert or open a file first, so I know whether to save as CSV or JSON.");
        return;
    }

    const extensions = activeFileType === "csv" ? [".csv"] : [".json"];
    const suggestedName = activeFileType === "csv" ? "data.csv" : "data.json";

    try {
        const savedName = await saveFile(activeFileType, content, extensions, suggestedName);
        if (savedName === null) return; // user cancelled picker
        setFileStatus(savedName);
    } catch (e) {
        showWarning(e.message);
    }
});

clearBtn.addEventListener("click", () => {
    inputBox.value = "";
    outputBox.value = "";
    clearWarning();
    clearFileHandles();
    setFileStatus("");
    activeFileType = null;
});