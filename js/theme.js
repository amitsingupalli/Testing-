\ufeff/* Theme Manager \u00e2\u20ac\u201d Agent Mentor */

const ThemeManager = {
    STORAGE_KEY: 'agent-mentor-theme',

    init() {
        const savedTheme = localStorage.getItem(this.STORAGE_KEY) || 'dark';
        this.setTheme(savedTheme);

        const toggle = document.getElementById('themeToggle');
        if (toggle) {
            toggle.addEventListener('click', () => this.toggle());
        }
    },

    setTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem(this.STORAGE_KEY, theme);

        const toggle = document.getElementById('themeToggle');
        if (toggle) {
            toggle.textContent = theme === 'dark' ? '\uD83C\uDF19' : '\u2600\uFE0F';
        }
    },

    toggle() {
        const current = document.documentElement.getAttribute('data-theme');
        const next = current === 'dark' ? 'light' : 'dark';
        this.setTheme(next);
    },

    getTheme() {
        return document.documentElement.getAttribute('data-theme') || 'dark';
    }
};

// Initialize on DOM load
document.addEventListener('DOMContentLoaded', () => ThemeManager.init());
