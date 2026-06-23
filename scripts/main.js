import { jsonToCsv } from "./jsonToCsv.js";
import { isValidJson } from "./validators.js";
import {
    jsonInput,
    csvOutput,
    convertBtn,
    clearBtn,
    showWarning,
    clearWarning,
} from "./dom.js";

convertBtn.addEventListener("click", () => {
    clearWarning();

    const rawInput = jsonInput.value;
    const parsed = isValidJson(rawInput);

    if (parsed === null) {
        showWarning("Please enter valid, non-empty JSON.");
        csvOutput.value = "";
        return;
    }

    try {
        csvOutput.value = jsonToCsv(parsed);
    } catch (e) {
        showWarning(e.message);
        csvOutput.value = "";
    }
});

clearBtn.addEventListener("click", () => {
    jsonInput.value = "";
    csvOutput.value = "";
    clearWarning();
});