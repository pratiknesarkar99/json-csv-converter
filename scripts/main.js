import { jsonToCsv } from "./jsonToCsv.js";
import { csvToJson } from "./csvToJson.js";
import { isValidJson } from "./validators.js";
import { openFile, saveFile, clearCurrentFileHandle } from "./fileIO.js";
import {
    inputBox,
    outputBox,
    toCsvBtn,
    toJsonBtn,
    clearBtn,
    openCsvBtn,
    saveCsvBtn,
    showWarning,
    clearWarning,
    setFileStatus,
} from "./dom.js";

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

    try {
        outputBox.value = jsonToCsv(parsed);
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
    } catch (e) {
        showWarning(e.message);
        outputBox.value = "";
    }
});

openCsvBtn.addEventListener("click", async () => {
    clearWarning();

    try {
        const result = await openFile([".csv"]);
        if (result === null) return; // user cancelled picker

        inputBox.value = result.content;
        setFileStatus(result.name);
    } catch (e) {
        showWarning(e.message);
    }
});

saveCsvBtn.addEventListener("click", async () => {
    clearWarning();

    // CSV content is whichever box currently holds it: prefer output (result
    // of a "To CSV" conversion), fall back to input (a CSV file opened directly).
    const content = outputBox.value.trim() !== "" ? outputBox.value : inputBox.value;

    if (content.trim() === "") {
        showWarning("Nothing to save. Convert or load some CSV first.");
        return;
    }

    try {
        const savedName = await saveFile(content, [".csv"], "data.csv");
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
    clearCurrentFileHandle();
    setFileStatus("");
});