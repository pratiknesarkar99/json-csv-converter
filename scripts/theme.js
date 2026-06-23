/**
 * Handles light/dark theme switching. Persists the choice in localStorage
 * and applies it via a data-theme attribute on <html>, which the CSS
 * variables in style.css key off of.
 */

const STORAGE_KEY = "csv2json-theme";
const DEFAULT_THEME = "dark";

function getStoredTheme() {
    try {
        return localStorage.getItem(STORAGE_KEY);
    } catch (e) {
        // localStorage may be unavailable (e.g. private browsing); fall back silently
        return null;
    }
}

function storeTheme(theme) {
    try {
        localStorage.setItem(STORAGE_KEY, theme);
    } catch (e) {
        // Non-fatal if storage is unavailable
    }
}

function applyTheme(theme) {
    document.documentElement.setAttribute("data-theme", theme);
}

function getInitialTheme() {
    const stored = getStoredTheme();
    if (stored === "light" || stored === "dark") return stored;

    const prefersLight =
        window.matchMedia &&
        window.matchMedia("(prefers-color-scheme: light)").matches;

    return prefersLight ? "light" : DEFAULT_THEME;
}

// Apply theme immediately on load, before the toggle button is wired up,
// to avoid a flash of the wrong theme.
applyTheme(getInitialTheme());

const toggleBtn = document.getElementById("theme-toggle-btn");

toggleBtn.addEventListener("click", () => {
    const current = document.documentElement.getAttribute("data-theme");
    const next = current === "dark" ? "light" : "dark";
    applyTheme(next);
    storeTheme(next);
});