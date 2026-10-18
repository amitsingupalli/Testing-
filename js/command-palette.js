/* Global Command Palette & Keyboard Shortcuts â€” Agent Mentor */
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
        alert('ðŸ” Quick Jump Command Palette\\n\\nPress 1: Roadmap\\nPress 2: Study Plan\\nPress 3: Topics\\nPress 4: Progress Dashboard');
    }
};
document.addEventListener('DOMContentLoaded', () => CommandPalette.init());
