/* Lesson Renderer â€” Agent Mentor */

const LessonRenderer = {
    currentLesson: null,
    currentLevel: null,

    async init() {
        const params = new URLSearchParams(window.location.search);
        const level = params.get('level') || '1';
        const lesson = params.get('lesson') || '1';

        this.currentLevel = parseInt(level);
        this.currentLesson = parseInt(lesson);

        await this.loadLesson(level, lesson);
        this.initSidebar(level);
    },

    async loadLesson(level, lesson) {
        const levelMap = {
            '1': 'level-1-python',
            '4': 'level-4-llm',
            '5': 'level-5-llm-apis',
            '6': 'level-6-rag',
            '7': 'level-7-agents',
            '8': 'level-8-frameworks'
        };

        const levelDir = levelMap[level] || 'level-1-python';
        const lessonNum = lesson.toString().padStart(2, '0');
        const container = document.getElementById('lessonContent');

        try {
            const response = await fetch('data/lessons/' + levelDir + '/' + lessonNum + '.json');
            if (!response.ok) throw new Error('Lesson not found');
            const data = await response.json();
            this.renderLesson(data, container);
        } catch (err) {
            this.renderPlaceholder(container, level, lesson);
        }
    },

    renderLesson(data, container) {
        const lessonId = 'level-' + this.currentLevel + '-lesson-' + this.currentLesson;
        const isCompleted = typeof ProgressManager !== 'undefined' &&
            ProgressManager.getData().completedLessons.includes(lessonId);

        let html = '';

        // Breadcrumb
        html += '<div class="lesson-breadcrumb">';
        html += '<a href="roadmap.html">Roadmap</a> <span>/</span> ';
        html += '<a href="topics.html">Level ' + this.currentLevel + '</a> <span>/</span> ';
        html += '<span>' + data.title + '</span>';
        html += '</div>';

        // Title
        html += '<h1 class="lesson-title">' + data.title + '</h1>';
        html += '<div class="lesson-meta">';
        html += '<span class="badge">Level ' + this.currentLevel + '</span>';
        html += '<span class="badge">Lesson ' + this.currentLesson + '</span>';
        if (data.duration) html += '<span class="badge">' + data.duration + '</span>';
        html += '</div>';

        // Why this matters
        if (data.why) {
            html += '<div class="lesson-section">';
            html += '<div class="lesson-section-header"><span class="section-icon">\uD83C\uDFAF</span> Why this matters for AI Agents</div>';
            html += '<p>' + data.why + '</p>';
            html += '</div>';
        }

        // What you will learn
        if (data.objectives && data.objectives.length > 0) {
            html += '<div class="lesson-section">';
            html += '<div class="lesson-section-header"><span class="section-icon">\uD83D\uDCDA</span> What you will learn</div>';
            html += '<ul>' + data.objectives.map(o => '<li>' + o + '</li>').join('') + '</ul>';
            html += '</div>';
        }

        // Concept explanation
        if (data.concept) {
            html += '<div class="lesson-section">';
            html += '<div class="lesson-section-header"><span class="section-icon">\uD83E\uDDE0</span> Concept Explanation</div>';
            html += '<div>' + this.renderMarkdown(data.concept) + '</div>';
            html += '</div>';
        }

        // Code example
        if (data.code) {
            html += '<div class="lesson-section">';
            html += '<div class="lesson-section-header"><span class="section-icon">\uD83D\uDCBB</span> Code Example</div>';
            data.code.forEach(block => {
                html += '<div class="lesson-code-block code-window">';
                html += '<div class="code-header">';
                html += '<span class="dot red"></span><span class="dot yellow"></span><span class="dot green"></span>';
                html += '<span class="code-title">' + (block.filename || 'example.py') + '</span>';
                html += '<button class="copy-btn" onclick="LessonRenderer.copyCode(this)">Copy</button>';
                html += '</div>';
                html += '<pre class="code-body"><code class="language-' + (block.language || 'python') + '">' + this.escapeHtml(block.content) + '</code></pre>';
                html += '</div>';
            });
            html += '</div>';
        }

        // Practice task
        if (data.practice) {
            html += '<div class="lesson-section">';
            html += '<div class="lesson-section-header"><span class="section-icon">\uD83D\uDD27</span> Practice Task</div>';
            html += '<p>' + data.practice.description + '</p>';
            if (data.practice.hint) {
                html += '<details style="margin-top: 1rem;"><summary style="cursor:pointer; color: var(--accent-primary); font-weight: 600;">\uD83D\uDCA1 Hint</summary>';
                html += '<p style="margin-top: 0.5rem;">' + data.practice.hint + '</p></details>';
            }
            html += '</div>';
        }

        // Mini project
        if (data.project) {
            html += '<div class="lesson-section">';
            html += '<div class="lesson-section-header"><span class="section-icon">\uD83D\uDE80</span> Mini Project</div>';
            html += '<p>' + data.project.description + '</p>';
            if (data.project.requirements) {
                html += '<ul>' + data.project.requirements.map(r => '<li>' + r + '</li>').join('') + '</ul>';
            }
            html += '</div>';
        }

        // Mastery checklist
        if (data.checklist && data.checklist.length > 0) {
            html += '<div class="lesson-section">';
            html += '<div class="lesson-section-header"><span class="section-icon">\u2705</span> Mastery Checklist</div>';
            html += '<div class="lesson-checklist">';
            data.checklist.forEach((item, index) => {
                const checked = typeof ProgressManager !== 'undefined' &&
                    ProgressManager.isChecklistCompleted(lessonId, index);
                html += '<div class="checklist-item ' + (checked ? 'completed' : '') + '" onclick="LessonRenderer.toggleChecklist(' + index + ')">';
                html += '<div class="checklist-checkbox"></div>';
                html += '<span class="checklist-label">' + item + '</span>';
                html += '</div>';
            });
            html += '</div>';
            html += '</div>';
        }

        // Common mistakes
        if (data.mistakes && data.mistakes.length > 0) {
            html += '<div class="lesson-section" style="border-left: 3px solid var(--warning);">';
            html += '<div class="lesson-section-header"><span class="section-icon">\u26A0\uFE0F</span> Common Mistakes</div>';
            html += '<ul>' + data.mistakes.map(m => '<li>' + m + '</li>').join('') + '</ul>';
            html += '</div>';
        }

        // What is next
        if (data.next) {
            html += '<div class="lesson-section">';
            html += '<div class="lesson-section-header"><span class="section-icon">\uD83D\uDD01</span> What is Next</div>';
            html += '<p>' + data.next + '</p>';
            html += '</div>';
        }

        // Mark complete button
        html += '<div class="lesson-nav">';
        if (this.currentLesson > 1) {
            html += '<a href="lesson.html?level=' + this.currentLevel + '&lesson=' + (this.currentLesson - 1) + '" class="btn btn-secondary">\u2190 Previous</a>';
        } else {
            html += '<div></div>';
        }
        html += '<button class="mark-complete-btn ' + (isCompleted ? 'completed' : '') + '" onclick="LessonRenderer.markComplete()">';
        html += isCompleted ? '\u2705 Completed' : '\u2705 Mark as Complete';
        html += '</button>';
        html += '<a href="lesson.html?level=' + this.currentLevel + '&lesson=' + (this.currentLesson + 1) + '" class="btn btn-primary">Next \u2192</a>';
        html += '</div>';

        container.innerHTML = html;

        // Re-highlight code
        if (typeof Prism !== 'undefined') {
            Prism.highlightAll();
        }
    },

    renderPlaceholder(container, level, lesson) {
        container.innerHTML = 
            <div class="lesson-breadcrumb">
                <a href="roadmap.html">Roadmap</a> <span>/</span>
                <a href="topics.html">Level </a> <span>/</span>
                <span>Lesson </span>
            </div>
            <h1 class="lesson-title">Lesson Coming Soon</h1>
            <div class="lesson-section">
                <div class="lesson-section-header"><span class="section-icon">\uD83D\uDEA7</span> Under Construction</div>
                <p>This lesson is being prepared. Check back soon!</p>
                <p>In the meantime, explore the <a href="roadmap.html" style="color: var(--accent-primary);">learning roadmap</a> or try another <a href="topics.html" style="color: var(--accent-primary);">topic</a>.</p>
            </div>
            <div class="lesson-nav">
                
                <div></div>
                <a href="lesson.html?level=&lesson=" class="btn btn-primary">Next \u2192</a>
            </div>
        ;
    },

    initSidebar(level) {
        // Sidebar is populated by the lesson.html inline script
    },

    toggleChecklist(index) {
        const lessonId = 'level-' + this.currentLevel + '-lesson-' + this.currentLesson;
        if (typeof ProgressManager !== 'undefined') {
            const completed = ProgressManager.toggleChecklist(lessonId, index);
            const items = document.querySelectorAll('.checklist-item');
            if (items[index]) {
                items[index].classList.toggle('completed', completed);
            }
        }
    },

    markComplete() {
        const lessonId = 'level-' + this.currentLevel + '-lesson-' + this.currentLesson;
        const btn = document.querySelector('.mark-complete-btn');
        if (typeof ProgressManager !== 'undefined') {
            const data = ProgressManager.getData();
            if (data.completedLessons.includes(lessonId)) {
                ProgressManager.uncompleteLesson(lessonId);
                btn.textContent = '\u2705 Mark as Complete';
                btn.classList.remove('completed');
            } else {
                ProgressManager.completeLesson(lessonId);
                btn.textContent = '\u2705 Completed';
                btn.classList.add('completed');
                if (typeof Utils !== 'undefined') {
                    Utils.showToast('Lesson completed! Great job! \uD83C\uDF89', 'success');
                }
            }
        }
    },

    async copyCode(btn) {
        const code = btn.closest('.code-window').querySelector('code').textContent;
        if (typeof Utils !== 'undefined') {
            const success = await Utils.copyToClipboard(code);
            btn.textContent = success ? 'Copied!' : 'Failed';
            setTimeout(() => { btn.textContent = 'Copy'; }, 2000);
        }
    },

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    },

    renderMarkdown(text) {
        // Simple markdown rendering
        return text
            .replace(/\*\*(.*?)\*\*/g, '<strong></strong>')
            .replace(/\*(.*?)\*/g, '<em></em>')
            .replace(/(.*?)/g, '<code></code>')
            .replace(/\n\n/g, '</p><p>')
            .replace(/\n/g, '<br>');
    }
};

// Initialize on DOM load
document.addEventListener('DOMContentLoaded', () => LessonRenderer.init());
