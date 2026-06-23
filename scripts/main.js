import { jsonToCsv } from "./jsonToCsv.js";
import { isValidJson } from "./validators.js";
import {
    inputBox,
    outputBox,
    toCsvBtn,
    toJsonBtn,
    clearBtn,
    showWarning,
    clearWarning,
} from "./dom.js";

toCsvBtn.addEventListener("click", () => {
    clearWarning();

    const rawInput = inputBox.value;
    const parsed = isValidJson(rawInput);

    if (parsed === null) {
        showWarning("Please enter valid, non-empty JSON.");
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
    showWarning("CSV to JSON conversion is coming soon.");
});

clearBtn.addEventListener("click", () => {
    inputBox.value = "";
    outputBox.value = "";
    clearWarning();
});