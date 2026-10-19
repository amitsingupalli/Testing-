\ufeff/* Global Command Palette & Keyboard Shortcuts \u00e2\u20ac\u201d Agent Mentor */
const CommandPalette = {
    init() {
        window.addEventListener('keydown', (e) => {
            if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
                e.preventDefault();
                this.toggleModal();
            }
        });
    },
    toggleModal() {
        alert('\u00f0\u0178\u201d\u008d Quick Jump Command Palette\\n\\nPress 1: Roadmap\\nPress 2: Study Plan\\nPress 3: Topics\\nPress 4: Progress Dashboard');
    }
};
document.addEventListener('DOMContentLoaded', () => CommandPalette.init());
