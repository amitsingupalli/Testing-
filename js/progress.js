\ufeff/* Progress Manager \u00e2\u20ac\u201d Agent Mentor */

const ProgressManager = {
    STORAGE_KEY: 'agent-mentor-progress',

    // Get all progress data
    getData() {
        const data = localStorage.getItem(this.STORAGE_KEY);
        return data ? JSON.parse(data) : this.getDefaultData();
    },

    // Save progress data
    saveData(data) {
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(data));
    },

    // Default progress structure
    getDefaultData() {
        return {
            completedLessons: [],
            completedQuizzes: [],
            checklist: {},
            streakDays: 0,
            lastStudyDate: null,
            totalStudyMinutes: 0,
            startDate: new Date().toISOString(),
            achievements: []
        };
    },

    // Mark a lesson as completed
    completeLesson(lessonId) {
        const data = this.getData();
        if (!data.completedLessons.includes(lessonId)) {
            data.completedLessons.push(lessonId);
            this.updateStreak(data);
            this.checkAchievements(data);
            this.saveData(data);
        }
        return data;
    },

    // Mark a lesson as incomplete
    uncompleteLesson(lessonId) {
        const data = this.getData();
        data.completedLessons = data.completedLessons.filter(id => id !== lessonId);
        this.saveData(data);
        return data;
    },

    // Toggle a checklist item
    toggleChecklist(lessonId, itemIndex) {
        const data = this.getData();
        const key = lessonId + '-' + itemIndex;
        if (!data.checklist) data.checklist = {};
        data.checklist[key] = !data.checklist[key];
        this.saveData(data);
        return data.checklist[key];
    },

    // Get checklist state
    isChecklistCompleted(lessonId, itemIndex) {
        const data = this.getData();
        const key = lessonId + '-' + itemIndex;
        return data.checklist ? data.checklist[key] || false : false;
    },

    // Update study streak
    updateStreak(data) {
        const today = new Date().toDateString();
        if (data.lastStudyDate !== today) {
            const yesterday = new Date();
            yesterday.setDate(yesterday.getDate() - 1);
            if (data.lastStudyDate === yesterday.toDateString()) {
                data.streakDays++;
            } else if (data.lastStudyDate !== today) {
                data.streakDays = 1;
            }
            data.lastStudyDate = today;
        }
    },

    // Check and award achievements
    checkAchievements(data) {
        const achievements = [
            { id: 'first-lesson', title: 'First Step', desc: 'Complete your first lesson', condition: () => data.completedLessons.length >= 1 },
            { id: 'five-lessons', title: 'Getting Started', desc: 'Complete 5 lessons', condition: () => data.completedLessons.length >= 5 },
            { id: 'ten-lessons', title: 'Dedicated Learner', desc: 'Complete 10 lessons', condition: () => data.completedLessons.length >= 10 },
            { id: 'twenty-lessons', title: 'Knowledge Seeker', desc: 'Complete 20 lessons', condition: () => data.completedLessons.length >= 20 },
            { id: 'streak-3', title: '3-Day Streak', desc: 'Study for 3 consecutive days', condition: () => data.streakDays >= 3 },
            { id: 'streak-7', title: 'Week Warrior', desc: 'Study for 7 consecutive days', condition: () => data.streakDays >= 7 },
            { id: 'streak-30', title: 'Month Master', desc: 'Study for 30 consecutive days', condition: () => data.streakDays >= 30 },
        ];

        achievements.forEach(achievement => {
            if (achievement.condition() && !data.achievements.includes(achievement.id)) {
                data.achievements.push(achievement.id);
            }
        });
    },

    // Get completion percentage for a level
    getLevelProgress(levelId, totalLessons) {
        const data = this.getData();
        const completed = data.completedLessons.filter(id => id.startsWith(levelId)).length;
        return totalLessons > 0 ? Math.round((completed / totalLessons) * 100) : 0;
    },

    // Get overall progress
    getOverallProgress() {
        const data = this.getData();
        return {
            completedLessons: data.completedLessons.length,
            streakDays: data.streakDays,
            achievements: data.achievements.length,
            lastStudyDate: data.lastStudyDate
        };
    },

    // Reset all progress
    reset() {
        localStorage.removeItem(this.STORAGE_KEY);
        return this.getDefaultData();
    }
};
