/* Quiz Engine â€” Agent Mentor */

const QuizEngine = {
    questions: [],
    currentIndex: 0,
    answers: [],
    score: 0,
    topic: '',

    async init() {
        const params = new URLSearchParams(window.location.search);
        this.topic = params.get('topic') || 'python';
        await this.loadQuiz(this.topic);
    },

    async loadQuiz(topic) {
        const container = document.getElementById('quizContainer');
        try {
            const response = await fetch('data/quizzes/' + topic + '-quiz.json');
            if (!response.ok) throw new Error('Quiz not found');
            const data = await response.json();
            this.questions = data.questions;
            this.renderStart(data, container);
        } catch (err) {
            container.innerHTML = '<div class="quiz-start"><h2>Quiz Coming Soon</h2><p>This quiz is being prepared. Try the <a href="quiz.html?topic=python">Python Quiz</a>!</p></div>';
        }
    },

    renderStart(data, container) {
        container.innerHTML = 
            <div class="quiz-start">
                <h2></h2>
                <p></p>
                <div class="quiz-info">
                    <div class="quiz-info-item">
                        <div class="quiz-info-value"></div>
                        <div class="quiz-info-label">Questions</div>
                    </div>
                    <div class="quiz-info-item">
                        <div class="quiz-info-value"></div>
                        <div class="quiz-info-label">Difficulty</div>
                    </div>
                    <div class="quiz-info-item">
                        <div class="quiz-info-value">m</div>
                        <div class="quiz-info-label">Est. Time</div>
                    </div>
                </div>
                <button class="btn btn-primary btn-lg" onclick="QuizEngine.startQuiz()">Start Quiz</button>
            </div>
        ;
    },

    startQuiz() {
        this.currentIndex = 0;
        this.answers = new Array(this.questions.length).fill(null);
        this.score = 0;
        this.renderQuestion();
    },

    renderQuestion() {
        const container = document.getElementById('quizContainer');
        const q = this.questions[this.currentIndex];
        const progress = ((this.currentIndex) / this.questions.length) * 100;

        let html = '';

        // Progress
        html += '<div class="quiz-progress">';
        html += '<div class="quiz-progress-info">';
        html += '<span>Question ' + (this.currentIndex + 1) + ' of ' + this.questions.length + '</span>';
        html += '<span>' + Math.round(progress) + '% complete</span>';
        html += '</div>';
        html += '<div class="progress-bar"><div class="progress-fill" style="width: ' + progress + '%"></div></div>';
        html += '</div>';

        // Question
        html += '<div class="question-card">';
        html += '<div class="question-number">Question ' + (this.currentIndex + 1) + '</div>';
        html += '<div class="question-text">' + q.question + '</div>';

        if (q.code) {
            html += '<div class="question-code code-window">';
            html += '<div class="code-header"><span class="dot red"></span><span class="dot yellow"></span><span class="dot green"></span></div>';
            html += '<pre class="code-body"><code class="language-python">' + this.escapeHtml(q.code) + '</code></pre>';
            html += '</div>';
        }

        html += '<div class="options-list">';
        q.options.forEach((opt, i) => {
            const selected = this.answers[this.currentIndex] === i;
            html += '<div class="option-item ' + (selected ? 'selected' : '') + '" onclick="QuizEngine.selectOption(' + i + ')">';
            html += '<div class="option-radio"></div>';
            html += '<span>' + opt + '</span>';
            html += '</div>';
        });
        html += '</div>';
        html += '</div>';

        // Actions
        html += '<div class="quiz-actions">';
        if (this.currentIndex > 0) {
            html += '<button class="btn btn-secondary" onclick="QuizEngine.prevQuestion()">Previous</button>';
        }
        if (this.currentIndex < this.questions.length - 1) {
            html += '<button class="btn btn-primary" onclick="QuizEngine.nextQuestion()">Next Question</button>';
        } else {
            html += '<button class="btn btn-primary" onclick="QuizEngine.submitQuiz()">Submit Quiz</button>';
        }
        html += '</div>';

        container.innerHTML = html;

        if (typeof Prism !== 'undefined') Prism.highlightAll();
    },

    selectOption(index) {
        this.answers[this.currentIndex] = index;
        this.renderQuestion();
    },

    nextQuestion() {
        if (this.currentIndex < this.questions.length - 1) {
            this.currentIndex++;
            this.renderQuestion();
        }
    },

    prevQuestion() {
        if (this.currentIndex > 0) {
            this.currentIndex--;
            this.renderQuestion();
        }
    },

    submitQuiz() {
        this.score = 0;
        this.questions.forEach((q, i) => {
            if (this.answers[i] === q.correct) {
                this.score++;
            }
        });
        this.renderResults();

        // Save to progress
        if (typeof ProgressManager !== 'undefined') {
            const data = ProgressManager.getData();
            const quizId = this.topic + '-quiz';
            if (!data.completedQuizzes.includes(quizId)) {
                data.completedQuizzes.push(quizId);
                ProgressManager.saveData(data);
            }
        }
    },

    renderResults() {
        const container = document.getElementById('quizContainer');
        const percentage = Math.round((this.score / this.questions.length) * 100);
        let grade, message;

        if (percentage >= 90) { grade = 'excellent'; message = 'Outstanding! You have mastered this topic!'; }
        else if (percentage >= 70) { grade = 'good'; message = 'Great job! Review the missed questions and try again.'; }
        else if (percentage >= 50) { grade = 'average'; message = 'Good effort! Review the lessons and retake the quiz.'; }
        else { grade = 'poor'; message = 'Keep learning! Review the lessons and practice more.'; }

        let html = '<div class="quiz-results">';
        html += '<div class="results-score ' + grade + '">' + this.score + '/' + this.questions.length + '</div>';
        html += '<div style="font-size: 1.25rem; color: var(--text-secondary); margin-bottom: 0.5rem;">' + percentage + '%</div>';
        html += '<div class="results-message">' + message + '</div>';

        // Breakdown
        html += '<div class="results-breakdown">';
        html += '<h3 style="margin-bottom: 1rem;">Answer Review</h3>';
        this.questions.forEach((q, i) => {
            const isCorrect = this.answers[i] === q.correct;
            html += '<div class="result-item">';
            html += '<span class="result-icon">' + (isCorrect ? '\u2705' : '\u274C') + '</span>';
            html += '<div>';
            html += '<strong>Q' + (i + 1) + ': ' + q.question + '</strong>';
            if (!isCorrect) {
                html += '<div class="result-explanation">';
                html += 'Your answer: ' + (this.answers[i] !== null ? q.options[this.answers[i]] : 'Not answered') + '<br>';
                html += 'Correct answer: ' + q.options[q.correct];
                if (q.explanation) html += '<br>' + q.explanation;
                html += '</div>';
            }
            html += '</div>';
            html += '</div>';
        });
        html += '</div>';

        html += '<div class="results-actions">';
        html += '<button class="btn btn-primary" onclick="QuizEngine.startQuiz()">Retake Quiz</button>';
        html += '<a href="topics.html" class="btn btn-secondary">Back to Topics</a>';
        html += '</div>';
        html += '</div>';

        container.innerHTML = html;
    },

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
};

document.addEventListener('DOMContentLoaded', () => QuizEngine.init());
