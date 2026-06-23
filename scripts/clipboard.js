import { inputBox, outputBox, copyInputBtn, copyOutputBtn, showWarning } from "./dom.js";

async function copyToClipboard(text, button) {
    if (!text.trim()) return;

    try {
        await navigator.clipboard.writeText(text);
        const original = button.textContent;
        button.textContent = "✓";
        setTimeout(() => { button.textContent = original; }, 1200);
    } catch (e) {
        showWarning("Could not copy to clipboard.");
    }
}

copyInputBtn.addEventListener("click", () => {
    copyToClipboard(inputBox.value, copyInputBtn);
});

copyOutputBtn.addEventListener("click", () => {
    copyToClipboard(outputBox.value, copyOutputBtn);
});