import {
    jsonInput,
    csvOutput,
    convertBtn,
    clearBtn,
    showWarning,
    clearWarning,
} from "./dom.js";


clearBtn.addEventListener("click", () => {
    jsonInput.value = "";
    csvOutput.value = "";
    clearWarning();
});