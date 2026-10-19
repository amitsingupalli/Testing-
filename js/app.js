\ufeff/* Main App \u00e2\u20ac\u201d Agent Mentor */

const App = {
    init() {
        this.initNavbar();
        this.initSmoothScroll();
        this.initRoadmapPreview();
        this.setActiveNavLink();
    },

    // Navbar scroll effect and hamburger menu
    initNavbar() {
        const navbar = document.getElementById('navbar');
        const hamburger = document.getElementById('hamburger');
        const navLinks = document.getElementById('navLinks');

        // Scroll effect
        if (navbar) {
            window.addEventListener('scroll', () => {
                if (window.scrollY > 50) {
                    navbar.classList.add('scrolled');
                } else {
                    navbar.classList.remove('scrolled');
                }
            });
        }

        // Hamburger menu toggle
        if (hamburger && navLinks) {
            hamburger.addEventListener('click', () => {
                navLinks.classList.toggle('open');
                hamburger.classList.toggle('active');
            });

            // Close menu on link click
            navLinks.querySelectorAll('.nav-link').forEach(link => {
                link.addEventListener('click', () => {
                    navLinks.classList.remove('open');
                    hamburger.classList.remove('active');
                });
            });
        }
    },

    // Smooth scroll for anchor links
    initSmoothScroll() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                e.preventDefault();
                const target = document.querySelector(anchor.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            });
        });
    },

    // Set active navigation link based on current page
    setActiveNavLink() {
        const currentPage = window.location.pathname.split('/').pop() || 'index.html';
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('active');
            const href = link.getAttribute('href');
            if (href === currentPage || (currentPage === '' && href === 'index.html')) {
                link.classList.add('active');
            }
        });
    },

    // Populate roadmap preview on homepage
    initRoadmapPreview() {
        const timeline = document.getElementById('roadmapTimeline');
        if (!timeline) return;

        const levels = [
            { level: 0, title: 'Setup & Fundamentals', desc: 'IDE, terminal, Python installation', icon: '\u2699\uFE0F' },
            { level: 1, title: 'Python for AI Agents', desc: 'Data types, async/await, Pydantic', icon: '\uD83D\uDC0D' },
            { level: 2, title: 'Git, GitHub & Linux', desc: 'Version control, environments', icon: '\uD83D\uDD00' },
            { level: 3, title: 'APIs & Backend Basics', desc: 'REST, HTTP, JSON, authentication', icon: '\uD83C\uDF10' },
            { level: 4, title: 'LLM Fundamentals', desc: 'How LLMs work, prompt engineering', icon: '\uD83E\uDDE0' },
            { level: 5, title: 'LLM APIs & Tool Calling', desc: 'OpenAI/Gemini APIs, function calling', icon: '\uD83D\uDD27' },
            { level: 6, title: 'RAG & Vector Databases', desc: 'Embeddings, Chroma, document QA', icon: '\uD83D\uDCDA' },
            { level: 7, title: 'Agent Architecture', desc: 'ReAct, memory, planning, tool use', icon: '\uD83C\uDFD7\uFE0F' },
            { level: 8, title: 'Agent Frameworks', desc: 'LangChain, LangGraph, CrewAI', icon: '\u26D3\uFE0F' },
            { level: 9, title: 'Multi-Agent Systems', desc: 'MCP, orchestration, HITL', icon: '\uD83D\uDC65' },
            { level: 10, title: 'FastAPI & Databases', desc: 'REST APIs, PostgreSQL, MongoDB', icon: '\u26A1' },
            { level: 11, title: 'Docker & LLMOps', desc: 'Containers, cloud, monitoring', icon: '\uD83D\uDC33' },
            { level: 12, title: 'Frontend for Agents', desc: 'React/Next.js, chat UIs, streaming', icon: '\uD83C\uDFA8' },
            { level: 13, title: 'AI Safety & Testing', desc: 'Guardrails, red teaming, evaluation', icon: '\uD83D\uDEE1\uFE0F' },
            { level: 14, title: 'Portfolio & Career', desc: 'Projects, interviews, freelancing', icon: '\uD83D\uDE80' }
        ];

        timeline.innerHTML = levels.map(l => 
            <div class="timeline-item" onclick="window.location.href='roadmap.html#level-'">
                <div class="timeline-level"></div>
                <div class="timeline-info">
                    <div class="timeline-title">Level : </div>
                    <div class="timeline-desc"></div>
                </div>
                <div class="timeline-arrow">\u2192</div>
            </div>
        ).join('');
    }
};

// Initialize app on DOM load
document.addEventListener('DOMContentLoaded', () => App.init());
