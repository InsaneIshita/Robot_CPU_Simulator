// ==========================================
// Robot CPU Simulator - LocalStorage Manager
// ==========================================

const STORAGE_KEYS = {
    PROGRESS: 'robot_cpu_progress_v1',
    SETTINGS: 'robot_cpu_settings_v1',
    PROGRAMS: 'robot_cpu_programs_v4'
};

const StorageManager = {
    // Default initial progress state
    getDefaultProgress() {
        return {
            unlockedLevel: 1,
            currentLevel: 1,
            levelStats: {}, // { [levelId]: { completed: true, bestScore: 25, stars: 3 } }
            totalPoints: 0
        };
    },

    // Default settings
    getDefaultSettings() {
        return {
            showAddressLabels: true,
            soundEnabled: true,
            speed: 'normal', // 'slow' (900ms), 'normal' (450ms), 'fast' (180ms)
            stepMode: 'micro' // 'micro' (Fetch->Decode->Execute->WriteBack) or 'macro' (full instruction)
        };
    },

    getProgress() {
        try {
            const raw = localStorage.getItem(STORAGE_KEYS.PROGRESS);
            if (!raw) return this.getDefaultProgress();
            const data = JSON.parse(raw);
            return { ...this.getDefaultProgress(), ...data };
        } catch (e) {
            console.warn('LocalStorage error reading progress:', e);
            return this.getDefaultProgress();
        }
    },

    saveProgress(progress) {
        try {
            localStorage.setItem(STORAGE_KEYS.PROGRESS, JSON.stringify(progress));
        } catch (e) {
            console.warn('LocalStorage error saving progress:', e);
        }
    },

    recordLevelCompletion(levelId, score, instructionCount) {
        const progress = this.getProgress();
        const currentStats = progress.levelStats[levelId] || { completed: false, bestScore: 0, bestInstructions: 999 };
        
        const isBetterScore = score > currentStats.bestScore;
        const newStats = {
            completed: true,
            bestScore: Math.max(currentStats.bestScore, score),
            bestInstructions: Math.min(currentStats.bestInstructions || 999, instructionCount)
        };

        progress.levelStats[levelId] = newStats;

        // Unlock next level if this was highest level
        if (levelId >= progress.unlockedLevel && levelId < 10) {
            progress.unlockedLevel = levelId + 1;
        }

        // Calculate cumulative total points from best scores
        progress.totalPoints = Object.values(progress.levelStats).reduce((sum, stat) => sum + (stat.bestScore || 0), 0);

        this.saveProgress(progress);
        return { isBetterScore, progress };
    },

    getSettings() {
        try {
            const raw = localStorage.getItem(STORAGE_KEYS.SETTINGS);
            if (!raw) return this.getDefaultSettings();
            return { ...this.getDefaultSettings(), ...JSON.parse(raw) };
        } catch (e) {
            console.warn('LocalStorage error reading settings:', e);
            return this.getDefaultSettings();
        }
    },

    saveSettings(settings) {
        try {
            localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
        } catch (e) {
            console.warn('LocalStorage error saving settings:', e);
        }
    },

    // Save custom program written by player for a specific level
    saveLevelProgram(levelId, program) {
        try {
            const raw = localStorage.getItem(STORAGE_KEYS.PROGRAMS);
            const progs = raw ? JSON.parse(raw) : {};
            progs[levelId] = program;
            localStorage.setItem(STORAGE_KEYS.PROGRAMS, JSON.stringify(progs));
        } catch (e) {
            console.warn('LocalStorage error saving level program:', e);
        }
    },

    getLevelProgram(levelId) {
        try {
            const raw = localStorage.getItem(STORAGE_KEYS.PROGRAMS);
            if (!raw) return null;
            const progs = JSON.parse(raw);
            return progs[levelId] || null;
        } catch (e) {
            return null;
        }
    },

    resetAllProgress() {
        try {
            localStorage.removeItem(STORAGE_KEYS.PROGRESS);
            localStorage.removeItem(STORAGE_KEYS.PROGRAMS);
            return this.getDefaultProgress();
        } catch (e) {
            return this.getDefaultProgress();
        }
    }
};

window.storageManager = StorageManager;

