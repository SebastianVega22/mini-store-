const KEY = "theme"; // "light" | "dark" | "system"

export function getInitialTheme() {
    const saved = localStorage.getItem(KEY);
    if (saved === "light" || saved === "dark") return saved;
    return "system";
}

export function applyTheme(theme) {
    const root = document.documentElement;
    const prefersDark = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
    const effective = theme === "system" ? (prefersDark ? "dark" : "light") : theme;
    root.setAttribute("data-theme", effective === "dark" ? "dark" : "light");
}

export function setTheme(theme) {
    localStorage.setItem(KEY, theme);
    applyTheme(theme);
}