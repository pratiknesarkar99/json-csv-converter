import { jsonToCsv } from "./jsonToCsv.js";
import { csvToJson } from "./csvToJson.js";
import { isValidJson } from "./validators.js";
import { openFile, saveFile, clearFileHandles } from "./fileIO.js";
import {
    inputBox,
    outputBox,
    toCsvBtn,
    toJsonBtn,
    clearBtn,
    openCsvBtn,
    saveCsvBtn,
    openJsonBtn,
    saveJsonBtn,
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

    // A single object (not already an array) is common for real-world API
    // responses. Wrap it so the user doesn't have to manually add brackets.
    const data = Array.isArray(parsed) ? parsed : [parsed];

    try {
        outputBox.value = jsonToCsv(data);
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
        const result = await openFile("csv", [".csv"]);
        if (result === null) return; // user cancelled picker

        inputBox.value = result.content;
        setFileStatus(result.name);
    } catch (e) {
        showWarning(e.message);
    }
});

openJsonBtn.addEventListener("click", async () => {
    clearWarning();

    try {
        const result = await openFile("json", [".json"]);
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
        const savedName = await saveFile("csv", content, [".csv"], "data.csv");
        if (savedName === null) return; // user cancelled picker
        setFileStatus(savedName);
    } catch (e) {
        showWarning(e.message);
    }
});

saveJsonBtn.addEventListener("click", async () => {
    clearWarning();

    // JSON content is whichever box currently holds it: prefer output (result
    // of a "To JSON" conversion), fall back to input (a JSON file opened directly).
    const content = outputBox.value.trim() !== "" ? outputBox.value : inputBox.value;

    if (content.trim() === "") {
        showWarning("Nothing to save. Convert or load some JSON first.");
        return;
    }

    try {
        const savedName = await saveFile("json", content, [".json"], "data.json");
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
});