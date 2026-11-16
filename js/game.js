// ==========================================
// Robot CPU Simulator - Game Controller
// ==========================================

const GAME_STATES = {
    READY: 'READY',
    RUNNING: 'RUNNING',
    PAUSED: 'PAUSED',
    COMPLETED: 'COMPLETED',
    HALTED: 'HALTED'
};

class GameController {
    constructor() {
        this.currentLevelId = 1;
        this.currentLevel = null;
        this.program = [];
        this.state = GAME_STATES.READY;
        this.points = 0;
        this.runTimer = null;
        this.speed = 'normal'; // 'slow', 'normal', 'fast'
        this.speedIntervals = {
            slow: 900,
            normal: 450,
            fast: 160
        };
        this.lastStatusMessage = 'Ready. Add instructions and click Run or Next Step.';
    }

    init() {
        // Load settings and progress from LocalStorage
        const settings = window.storageManager.getSettings();
        this.speed = settings.speed || 'normal';
        if (window.soundManager) {
            window.soundManager.setEnabled(settings.soundEnabled ?? true);
        }

        const progress = window.storageManager.getProgress();
        this.currentLevelId = progress.currentLevel || 1;
        if (this.currentLevelId > 10) this.currentLevelId = 1;

        this.loadLevel(this.currentLevelId);
    }

    loadLevel(levelId) {
        this.pause();
        this.currentLevelId = levelId;
        const levelData = window.LEVELS_DATA.find(lvl => lvl.id === levelId) || window.LEVELS_DATA[0];
        this.currentLevel = levelData;

        // Try to load player's saved program for this level, or fallback to starter program
        const savedProg = window.storageManager.getLevelProgram(levelId);
        if (savedProg && savedProg.length > 0) {
            this.program = JSON.parse(JSON.stringify(savedProg));
        } else {
            this.program = JSON.parse(JSON.stringify(levelData.starterProgram || []));
        }

        this.reset();

        // Update progress currentLevel
        const progress = window.storageManager.getProgress();
        progress.currentLevel = levelId;
        window.storageManager.saveProgress(progress);

        if (window.uiManager) {
            window.uiManager.renderFullUI();
        }
    }

    reset() {
        this.pause();
        this.state = GAME_STATES.READY;
        this.points = 0;
        this.lastStatusMessage = 'System reset. Ready to execute program.';

        // Reset CPU
        window.cpu.reset();

        // Reset Memory
        window.cpuMemory.reset();

        // Reset Robot World with level config
        window.robotWorld.reset(this.currentLevel);

        if (window.uiManager) {
            window.uiManager.renderFullUI();
        }
    }

    run() {
        if (this.state === GAME_STATES.RUNNING) return;
        if (this.state === GAME_STATES.COMPLETED) {
            this.reset();
        }

        if (this.program.length === 0) {
            alert('Please add at least one instruction before running.');
            return;
        }

        if (window.soundManager) window.soundManager.playClick();

        this.state = GAME_STATES.RUNNING;
        const interval = this.speedIntervals[this.speed] || 450;

        this.runTimer = setInterval(() => {
            const result = this.step();
            if (!result || result.finished || this.state !== GAME_STATES.RUNNING) {
                this.pause();
                if (result && result.error) {
                    this.state = GAME_STATES.HALTED;
                }
            }
        }, interval);

        if (window.uiManager) {
            window.uiManager.updateControlButtons();
        }
    }

    pause() {
        if (this.runTimer) {
            clearInterval(this.runTimer);
            this.runTimer = null;
        }
        if (this.state === GAME_STATES.RUNNING) {
            this.state = GAME_STATES.PAUSED;
            this.lastStatusMessage = 'Execution paused.';
        }
        if (window.soundManager) window.soundManager.playClick();
        if (window.uiManager) {
            window.uiManager.updateControlButtons();
            window.uiManager.updateStatusInfo();
        }
    }

    step() {
        if (this.state === GAME_STATES.COMPLETED) {
            return { finished: true };
        }

        if (this.program.length === 0) {
            alert('Please add at least one instruction before stepping.');
            return { finished: true };
        }

        const settings = window.storageManager.getSettings();
        let stepResult = null;

        if (settings.stepMode === 'macro') {
            // Execute all microstages for current instruction until FETCH stage of next
            const initialPc = window.cpu.pc;
            let guard = 0;
            do {
                stepResult = window.cpu.stepCycle(this.program);
                this._onMicroStepComplete(stepResult);
                guard++;
            } while (window.cpu.pc === initialPc && !window.cpu.isHalted && guard < 10);
        } else {
            // Default: Micro-step (Fetch -> Decode -> Execute -> WriteBack)
            stepResult = window.cpu.stepCycle(this.program);
            this._onMicroStepComplete(stepResult);
        }

        return stepResult;
    }

    _onMicroStepComplete(stepResult) {
        if (!stepResult) return;

        // Update score from collected items
        this._updateScore();

        if (stepResult.message) {
            this.lastStatusMessage = stepResult.message;
        }

        // Check if destination flag (24) was reached
        if (window.robotWorld.currentAddress === window.robotWorld.flagAddress) {
            this._handleLevelSuccess();
        } else if (stepResult.finished) {
            // Halted without reaching flag
            this.state = GAME_STATES.HALTED;
            if (window.robotWorld.currentAddress !== window.robotWorld.flagAddress) {
                this.lastStatusMessage += ' Stopped before reaching destination flag at [24].';
            }
        }

        if (window.uiManager) {
            window.uiManager.renderFullUI();
        }
    }

    _updateScore() {
        // Calculate points based on collected items in this attempt
        const collected = window.robotWorld.collectedItems;
        this.points = collected.reduce((sum, item) => sum + (item.value || 0), 0);
    }

    _handleLevelSuccess() {
        if (this.state === GAME_STATES.COMPLETED) return;

        this.pause();
        this.state = GAME_STATES.COMPLETED;
        this.lastStatusMessage = `🎉 Destination reached! Level ${this.currentLevelId} complete with ${this.points} points!`;

        if (window.soundManager) window.soundManager.playVictory();

        // Record progress in storage
        const completionResult = window.storageManager.recordLevelCompletion(
            this.currentLevelId,
            this.points,
            window.cpu.instructionCount
        );

        // Show level completion modal
        setTimeout(() => {
            if (window.uiManager) {
                window.uiManager.showVictoryModal({
                    levelId: this.currentLevelId,
                    levelName: this.currentLevel.name,
                    points: this.points,
                    itemsCount: window.robotWorld.collectedItems.length,
                    instructionsExecuted: window.cpu.instructionCount,
                    isBetterScore: completionResult.isBetterScore,
                    isLastLevel: this.currentLevelId === 10
                });
            }
        }, 300);
    }

    // Program Editor operations
    addInstruction(op = '-', r1 = '-', r2 = '-') {
        this.program.push({ op, r1, r2 });
        this._autoSaveProgram();
        if (window.uiManager) window.uiManager.renderProgramEditor();
    }

    removeInstruction(index) {
        if (index >= 0 && index < this.program.length) {
            this.program.splice(index, 1);
            this._autoSaveProgram();
            if (window.uiManager) window.uiManager.renderProgramEditor();
        }
    }

    updateInstruction(index, field, value) {
        if (index >= 0 && index < this.program.length) {
            this.program[index][field] = value;

            // Automatically clean or adjust operands when opcode changes
            if (field === 'op') {
                if (value === '-' || value === 'SELECT') {
                    this.program[index].op = '-';
                    this.program[index].r1 = '-';
                    this.program[index].r2 = '-';
                } else {
                    const meta = window.INSTRUCTION_SET[value];
                    if (meta) {
                        if (!meta.needsR1) this.program[index].r1 = '-';
                        else if (this.program[index].r1 === '-') this.program[index].r1 = 'R1';

                        if (!meta.needsR2) this.program[index].r2 = '-';
                        else if (this.program[index].r2 === '-') {
                            this.program[index].r2 = meta.r2Type === 'address' ? '[11]' : 'R2';
                        }
                    }
                }
            }

            this._autoSaveProgram();
            if (window.uiManager) window.uiManager.renderProgramEditor();
        }
    }

    _autoSaveProgram() {
        window.storageManager.saveLevelProgram(this.currentLevelId, this.program);
    }

    setSpeed(speed) {
        this.speed = speed;
        const settings = window.storageManager.getSettings();
        settings.speed = speed;
        window.storageManager.saveSettings(settings);

        if (this.state === GAME_STATES.RUNNING) {
            this.pause();
            this.run();
        }
    }
}

window.gameController = new GameController();
window.GAME_STATES = GAME_STATES;

