// ==========================================
// Robot CPU Simulator - UI Manager & Main Orchestrator
// ==========================================

class UIManager {
    constructor() {
        this.cacheDOM();
        this.bindEvents();
    }

    cacheDOM() {
        // Header
        this.levelBadge = document.getElementById('levelBadge');
        this.pointsBadge = document.getElementById('pointsBadge');
        this.addressToggle = document.getElementById('addressToggle');
        this.settingsBtn = document.getElementById('settingsBtn');

        // Grid
        this.gridContainer = document.getElementById('robotGrid');

        // Program Editor
        this.programTableBody = document.getElementById('programTableBody');
        this.btnAddInstruction = document.getElementById('btnAddInstruction');

        // CPU Panel
        this.pcValue = document.getElementById('pcValue');
        this.irValue = document.getElementById('irValue');
        this.cyclePills = {
            FETCH: document.getElementById('cycleStageFetch'),
            DECODE: document.getElementById('cycleStageDecode'),
            EXECUTE: document.getElementById('cycleStageExecute'),
            WRITE_BACK: document.getElementById('cycleStageWriteBack')
        };
        this.regValues = {
            R0: document.getElementById('regR0'),
            R1: document.getElementById('regR1'),
            R2: document.getElementById('regR2'),
            R3: document.getElementById('regR3')
        };
        this.aluValue = document.getElementById('aluValue');

        // Memory Panel
        this.tabMemInstructions = document.getElementById('tabMemInstructions');
        this.tabMemData = document.getElementById('tabMemData');
        this.memoryTableLeft = document.getElementById('memoryTableLeft');
        this.memoryTableRight = document.getElementById('memoryTableRight');

        // Current Instruction & Flow
        this.currentInstDisplay = document.getElementById('currentInstDisplay');
        this.instDetails = document.getElementById('instDetails');
        this.flowStages = {
            FETCH: document.getElementById('flowFetch'),
            DECODE: document.getElementById('flowDecode'),
            EXECUTE: document.getElementById('flowExecute'),
            WRITE_BACK: document.getElementById('flowWriteBack')
        };

        // Execution Controls
        this.btnRun = document.getElementById('btnRun');
        this.btnStep = document.getElementById('btnStep');
        this.btnPause = document.getElementById('btnPause');
        this.btnReset = document.getElementById('btnReset');

        // Modals
        this.victoryModal = document.getElementById('victoryModal');
        this.victoryDetails = document.getElementById('victoryDetails');
        this.btnNextLevel = document.getElementById('btnNextLevel');
        this.btnReplayLevel = document.getElementById('btnReplayLevel');
        this.btnCloseVictory = document.getElementById('btnCloseVictory');

        this.levelSelectModal = document.getElementById('levelSelectModal');
        this.levelGrid = document.getElementById('levelGrid');
        this.btnCloseLevelSelect = document.getElementById('btnCloseLevelSelect');

        this.settingsModal = document.getElementById('settingsModal');
        this.btnCloseSettings = document.getElementById('btnCloseSettings');
        this.soundSetting = document.getElementById('soundSetting');
        this.speedSetting = document.getElementById('speedSetting');
        this.stepModeSetting = document.getElementById('stepModeSetting');
        this.btnResetAllProgress = document.getElementById('btnResetAllProgress');
    }

    bindEvents() {
        // Address Toggle
        if (this.addressToggle) {
            this.addressToggle.addEventListener('change', (e) => {
                const show = e.target.checked;
                const settings = window.storageManager.getSettings();
                settings.showAddressLabels = show;
                window.storageManager.saveSettings(settings);
                this.updateAddressLabelsVisibility(show);
            });
        }

        // Program Editor buttons
        if (this.btnAddInstruction) {
            this.btnAddInstruction.addEventListener('click', () => {
                window.gameController.addInstruction('MOVE_RIGHT', '-', '-');
                if (window.soundManager) window.soundManager.playClick();
            });
        }

        // Execution Controls
        if (this.btnRun) {
            this.btnRun.addEventListener('click', () => window.gameController.run());
        }
        if (this.btnStep) {
            this.btnStep.addEventListener('click', () => {
                if (window.soundManager) window.soundManager.playClick();
                window.gameController.step();
            });
        }
        if (this.btnPause) {
            this.btnPause.addEventListener('click', () => window.gameController.pause());
        }
        if (this.btnReset) {
            this.btnReset.addEventListener('click', () => {
                if (window.soundManager) window.soundManager.playClick();
                window.gameController.reset();
            });
        }

        // Memory Tabs
        if (this.tabMemInstructions && this.tabMemData) {
            this.tabMemInstructions.addEventListener('click', () => {
                window.cpuMemory.setTab('instructions');
                this.updateMemoryTabs();
                this.renderMemory();
            });
            this.tabMemData.addEventListener('click', () => {
                window.cpuMemory.setTab('data');
                this.updateMemoryTabs();
                this.renderMemory();
            });
        }

        // Level Badge click to open Level Selector
        if (this.levelBadge) {
            this.levelBadge.addEventListener('click', () => this.openLevelSelectModal());
        }

        // Settings Modal triggers
        if (this.settingsBtn) {
            this.settingsBtn.addEventListener('click', () => this.openSettingsModal());
        }
        if (this.btnCloseSettings) {
            this.btnCloseSettings.addEventListener('click', () => this.closeSettingsModal());
        }

        // Settings changes
        if (this.soundSetting) {
            this.soundSetting.addEventListener('change', (e) => {
                const enabled = e.target.checked;
                const settings = window.storageManager.getSettings();
                settings.soundEnabled = enabled;
                window.storageManager.saveSettings(settings);
                if (window.soundManager) window.soundManager.setEnabled(enabled);
            });
        }

        if (this.speedSetting) {
            this.speedSetting.addEventListener('change', (e) => {
                window.gameController.setSpeed(e.target.value);
            });
        }

        if (this.stepModeSetting) {
            this.stepModeSetting.addEventListener('change', (e) => {
                const settings = window.storageManager.getSettings();
                settings.stepMode = e.target.value;
                window.storageManager.saveSettings(settings);
            });
        }

        if (this.btnResetAllProgress) {
            this.btnResetAllProgress.addEventListener('click', () => {
                if (confirm('Are you sure you want to reset all unlocked levels and high scores?')) {
                    window.storageManager.resetAllProgress();
                    window.gameController.loadLevel(1);
                    this.closeSettingsModal();
                }
            });
        }

        // Victory Modal buttons
        if (this.btnNextLevel) {
            this.btnNextLevel.addEventListener('click', () => {
                this.closeVictoryModal();
                const next = window.gameController.currentLevelId + 1;
                if (next <= 10) {
                    window.gameController.loadLevel(next);
                }
            });
        }

        if (this.btnReplayLevel) {
            this.btnReplayLevel.addEventListener('click', () => {
                this.closeVictoryModal();
                window.gameController.reset();
            });
        }

        if (this.btnCloseVictory) {
            this.btnCloseVictory.addEventListener('click', () => this.closeVictoryModal());
        }

        if (this.btnCloseLevelSelect) {
            this.btnCloseLevelSelect.addEventListener('click', () => this.closeLevelSelectModal());
        }

        // Close modals on overlay backdrop click
        [this.victoryModal, this.levelSelectModal, this.settingsModal].forEach(modal => {
            if (modal) {
                modal.addEventListener('click', (e) => {
                    if (e.target === modal) modal.classList.remove('active');
                });
            }
        });

        // Keyboard shortcuts for convenience
        document.addEventListener('keydown', (e) => {
            // Do not trigger shortcuts when inside select or input
            if (['SELECT', 'INPUT'].includes(e.target.tagName)) return;

            if (e.code === 'Space') {
                e.preventDefault();
                if (window.gameController.state === window.GAME_STATES.RUNNING) {
                    window.gameController.pause();
                } else {
                    window.gameController.run();
                }
            } else if (e.code === 'ArrowRight' || e.key === 'n' || e.key === 'N') {
                e.preventDefault();
                window.gameController.step();
            } else if (e.key === 'r' || e.key === 'R') {
                e.preventDefault();
                window.gameController.reset();
            }
        });
    }

    renderFullUI() {
        this.renderHeader();
        this.renderGrid();
        this.renderProgramEditor();
        this.renderCPU();
        this.renderMemory();
        this.renderCurrentInstruction();
        this.updateControlButtons();
    }

    renderHeader() {
        const lvl = window.gameController.currentLevelId;
        const pts = window.gameController.points;

        if (this.levelBadge) {
            this.levelBadge.innerHTML = `<span class="badge-icon">⭐</span> Level ${lvl} / 10`;
        }

        if (this.pointsBadge) {
            this.pointsBadge.innerHTML = `<span class="badge-icon">⭐</span> Points: ${pts}`;
        }

        const settings = window.storageManager.getSettings();
        if (this.addressToggle) {
            this.addressToggle.checked = settings.showAddressLabels ?? true;
        }
        this.updateAddressLabelsVisibility(settings.showAddressLabels ?? true);
    }

    updateAddressLabelsVisibility(show) {
        if (!this.gridContainer) return;
        if (show) {
            this.gridContainer.classList.remove('hide-addresses');
        } else {
            this.gridContainer.classList.add('hide-addresses');
        }
    }

    renderGrid() {
        if (!this.gridContainer) return;
        this.gridContainer.innerHTML = '';

        const robotWorld = window.robotWorld;
        const currentAddr = robotWorld.currentAddress;

        for (let addr = 0; addr < 25; addr++) {
            const cell = document.createElement('div');
            cell.className = 'grid-cell';
            cell.dataset.address = addr;

            // Cell Address label (top-right)
            const addrSpan = document.createElement('span');
            addrSpan.className = 'cell-address';
            addrSpan.textContent = String(addr).padStart(2, '0');
            cell.appendChild(addrSpan);

            // Cell Content Layer
            const contentDiv = document.createElement('div');
            contentDiv.className = 'cell-content';

            const isRobotHere = (addr === currentAddr);
            const collectible = robotWorld.getCollectibleAt(addr);
            const obstacle = robotWorld.isObstacleAt(addr);
            const isFlagHere = (addr === robotWorld.flagAddress);

            if (isRobotHere) {
                cell.classList.add('cell-robot');
                contentDiv.innerHTML = window.GridIcons.robot();
                if (isFlagHere) {
                    cell.classList.add('cell-victory');
                }
            } else if (obstacle) {
                cell.classList.add('cell-obstacle');
                const obsType = obstacle.type;
                if (window.GridIcons[obsType]) {
                    contentDiv.innerHTML = window.GridIcons[obsType]();
                } else {
                    contentDiv.innerHTML = window.GridIcons.wall();
                }
            } else if (collectible) {
                cell.classList.add('cell-collectible');
                const colType = collectible.type;
                if (window.GridIcons[colType]) {
                    contentDiv.innerHTML = window.GridIcons[colType]();
                } else {
                    contentDiv.innerHTML = window.GridIcons.diamond();
                }
            } else if (isFlagHere) {
                cell.classList.add('cell-flag');
                contentDiv.innerHTML = window.GridIcons.flag();
            }

            if (robotWorld.collisionCell === addr) {
                cell.classList.add('cell-collision-shake');
            }

            cell.appendChild(contentDiv);
            this.gridContainer.appendChild(cell);
        }
    }

    renderProgramEditor() {
        if (!this.programTableBody) return;
        this.programTableBody.innerHTML = '';

        const program = window.gameController.program;
        const activePc = window.cpu.pc;
        const isHalted = window.cpu.isHalted;

        program.forEach((inst, idx) => {
            const tr = document.createElement('tr');
            tr.className = 'program-row';
            if (!isHalted && idx === activePc) {
                tr.classList.add('active-row');
            }

            // Column 1: # (Instruction number in 2 digits)
            const tdNum = document.createElement('td');
            tdNum.className = 'col-num';
            tdNum.textContent = String(idx).padStart(2, '0');
            tr.appendChild(tdNum);

            // Column 2: Instruction Opcode Dropdown
            const tdOp = document.createElement('td');
            tdOp.className = 'col-op';
            const selectOp = document.createElement('select');
            selectOp.className = 'editor-select op-select';
            
            // Default placeholder option
            const defaultOpt = document.createElement('option');
            defaultOpt.value = '-';
            defaultOpt.textContent = '-- Select --';
            if (!inst.op || inst.op === '-' || inst.op === 'SELECT') {
                defaultOpt.selected = true;
            }
            selectOp.appendChild(defaultOpt);

            Object.keys(window.INSTRUCTION_SET).forEach(opKey => {
                const opt = document.createElement('option');
                opt.value = opKey;
                opt.textContent = opKey;
                if (inst.op === opKey) opt.selected = true;
                selectOp.appendChild(opt);
            });

            selectOp.addEventListener('change', (e) => {
                window.gameController.updateInstruction(idx, 'op', e.target.value);
            });
            tdOp.appendChild(selectOp);
            tr.appendChild(tdOp);

            const meta = window.INSTRUCTION_SET[inst.op] || {};

            // Column 3: Operand 1
            const tdR1 = document.createElement('td');
            tdR1.className = 'col-operand';
            const selectR1 = document.createElement('select');
            selectR1.className = 'editor-select r1-select';
            
            const r1Options = ['-'];
            if (meta.needsR1) {
                r1Options.push(...window.REGISTERS);
            }
            r1Options.forEach(r => {
                const opt = document.createElement('option');
                opt.value = r;
                opt.textContent = r;
                if (inst.r1 === r) opt.selected = true;
                selectR1.appendChild(opt);
            });

            if (!meta.needsR1) selectR1.disabled = true;

            selectR1.addEventListener('change', (e) => {
                window.gameController.updateInstruction(idx, 'r1', e.target.value);
            });
            tdR1.appendChild(selectR1);
            tr.appendChild(tdR1);

            // Column 4: Operand 2
            const tdR2 = document.createElement('td');
            tdR2.className = 'col-operand';
            const selectR2 = document.createElement('select');
            selectR2.className = 'editor-select r2-select';

            const r2Options = ['-'];
            if (meta.needsR2) {
                if (meta.r2Type === 'register') {
                    r2Options.push(...window.REGISTERS);
                } else if (meta.r2Type === 'address') {
                    for (let a = 0; a < 25; a++) {
                        r2Options.push(`[${String(a).padStart(2, '0')}]`);
                    }
                }
            }

            r2Options.forEach(r => {
                const opt = document.createElement('option');
                opt.value = r;
                opt.textContent = r;
                if (inst.r2 === r) opt.selected = true;
                selectR2.appendChild(opt);
            });

            if (!meta.needsR2) selectR2.disabled = true;

            selectR2.addEventListener('change', (e) => {
                window.gameController.updateInstruction(idx, 'r2', e.target.value);
            });
            tdR2.appendChild(selectR2);
            tr.appendChild(tdR2);

            // Column 5: Delete Action
            const tdAction = document.createElement('td');
            tdAction.className = 'col-action';
            const btnDelete = document.createElement('button');
            btnDelete.className = 'btn-delete-row';
            btnDelete.title = 'Delete Instruction';
            btnDelete.innerHTML = `
                <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round">
                    <polyline points="3 6 5 6 21 6"></polyline>
                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                    <line x1="10" y1="11" x2="10" y2="17"></line>
                    <line x1="14" y1="11" x2="14" y2="17"></line>
                </svg>`;

            btnDelete.addEventListener('click', () => {
                window.gameController.removeInstruction(idx);
                if (window.soundManager) window.soundManager.playClick();
            });
            tdAction.appendChild(btnDelete);
            tr.appendChild(tdAction);

            this.programTableBody.appendChild(tr);
        });
    }

    renderCPU() {
        const cpu = window.cpu;

        // PC
        if (this.pcValue) {
            this.pcValue.textContent = String(cpu.pc).padStart(2, '0');
        }

        // IR
        if (this.irValue) {
            this.irValue.textContent = cpu.ir ? window.InstructionHelper.formatDisplay(cpu.ir) : '-';
        }

        // Cycle stages (Fetch, Decode, Execute, Write Back)
        Object.keys(this.cyclePills).forEach(stage => {
            const el = this.cyclePills[stage];
            if (el) {
                if (cpu.currentStage === stage) {
                    el.classList.add('active');
                } else {
                    el.classList.remove('active');
                }
            }
        });

        // Registers
        Object.keys(this.regValues).forEach(reg => {
            const el = this.regValues[reg];
            if (el) {
                el.textContent = cpu.registers[reg] ?? 0;
            }
        });

        // ALU
        if (this.aluValue) {
            this.aluValue.textContent = cpu.alu.displayText || '-';
        }
    }

    updateMemoryTabs() {
        const active = window.cpuMemory.activeTab;
        if (active === 'instructions') {
            this.tabMemInstructions.classList.add('active');
            this.tabMemData.classList.remove('active');
        } else {
            this.tabMemData.classList.add('active');
            this.tabMemInstructions.classList.remove('active');
        }
    }

    renderMemory() {
        if (!this.memoryTableLeft || !this.memoryTableRight) return;
        this.memoryTableLeft.innerHTML = '';
        this.memoryTableRight.innerHTML = '';

        const isDataView = window.cpuMemory.activeTab === 'data';
        const lastAccessAddr = window.cpuMemory.lastAccessedAddress;
        const lastAccessType = window.cpuMemory.lastAccessType;

        // Render addresses 00 to 11 on Left, 12 to 24 on Right
        for (let addr = 0; addr < 25; addr++) {
            const targetTable = (addr <= 11) ? this.memoryTableLeft : this.memoryTableRight;

            const tr = document.createElement('tr');
            tr.className = 'mem-row';

            if (lastAccessAddr === addr) {
                tr.classList.add(lastAccessType === 'write' ? 'mem-accessed-write' : 'mem-accessed-read');
            }

            const tdAddr = document.createElement('td');
            tdAddr.className = 'mem-addr';
            tdAddr.textContent = String(addr).padStart(2, '0');

            const tdVal = document.createElement('td');
            tdVal.className = 'mem-val';

            if (isDataView) {
                const val = window.cpuMemory.data[addr];
                tdVal.textContent = (val !== null && val !== undefined) ? String(val) : '-';
                if (val !== null && val !== undefined) {
                    tdVal.classList.add('has-val');
                }
            } else {
                // Instruction Memory view
                const inst = window.gameController.program[addr];
                tdVal.textContent = inst ? window.InstructionHelper.formatDisplay(inst) : '-';
                if (inst) tdVal.classList.add('has-val');
            }

            tr.appendChild(tdAddr);
            tr.appendChild(tdVal);
            targetTable.appendChild(tr);
        }
    }

    renderCurrentInstruction() {
        const cpu = window.cpu;
        const explanation = window.InstructionHelper.getExplanation(cpu.ir, cpu.currentStage, cpu);

        if (this.currentInstDisplay) {
            this.currentInstDisplay.textContent = cpu.ir ? window.InstructionHelper.formatDisplay(cpu.ir) : '-';
        }

        if (this.instDetails) {
            this.instDetails.textContent = explanation.details || window.gameController.lastStatusMessage;
        }

        // Flow checkmarks
        const stagesOrder = ['FETCH', 'DECODE', 'EXECUTE', 'WRITE_BACK'];
        const currentStageIdx = stagesOrder.indexOf(cpu.currentStage);

        stagesOrder.forEach((stage, idx) => {
            const el = this.flowStages[stage];
            if (el) {
                el.classList.remove('active', 'completed');
                if (idx < currentStageIdx) {
                    el.classList.add('completed');
                } else if (idx === currentStageIdx) {
                    el.classList.add('active');
                }
            }
        });
    }

    updateControlButtons() {
        const isRunning = (window.gameController.state === window.GAME_STATES.RUNNING);

        if (this.btnRun) {
            if (isRunning) {
                this.btnRun.classList.add('running-active');
            } else {
                this.btnRun.classList.remove('running-active');
            }
        }
    }

    updateStatusInfo() {
        if (this.instDetails) {
            this.instDetails.textContent = window.gameController.lastStatusMessage;
        }
    }

    // Modal dialogs
    showVictoryModal(data) {
        if (!this.victoryModal || !this.victoryDetails) return;

        this.victoryDetails.innerHTML = `
            <div class="victory-stat-row">
                <span class="stat-label">Level:</span>
                <span class="stat-val">${data.levelId} - ${data.levelName}</span>
            </div>
            <div class="victory-stat-row highlight-stat">
                <span class="stat-label">Points Earned:</span>
                <span class="stat-val">${data.points} pts</span>
            </div>
            <div class="victory-stat-row">
                <span class="stat-label">Items Collected:</span>
                <span class="stat-val">${data.itemsCount}</span>
            </div>
            <div class="victory-stat-row">
                <span class="stat-label">Instructions Executed:</span>
                <span class="stat-val">${data.instructionsExecuted}</span>
            </div>
            ${data.isBetterScore ? '<div class="new-record-tag">⭐ New Personal Best Score! ⭐</div>' : ''}
        `;

        if (this.btnNextLevel) {
            if (data.isLastLevel) {
                this.btnNextLevel.style.display = 'none';
            } else {
                this.btnNextLevel.style.display = 'inline-flex';
            }
        }

        this.victoryModal.classList.add('active');
    }

    closeVictoryModal() {
        if (this.victoryModal) this.victoryModal.classList.remove('active');
    }

    openLevelSelectModal() {
        if (!this.levelSelectModal || !this.levelGrid) return;
        this.levelGrid.innerHTML = '';

        const progress = window.storageManager.getProgress();
        const unlocked = progress.unlockedLevel || 1;

        window.LEVELS_DATA.forEach(level => {
            const card = document.createElement('div');
            card.className = 'level-card';

            const isLocked = level.id > unlocked;
            const stats = progress.levelStats[level.id];
            const isCompleted = stats && stats.completed;
            const isCurrent = (level.id === window.gameController.currentLevelId);

            if (isCurrent) card.classList.add('current');
            if (isLocked) card.classList.add('locked');
            if (isCompleted) card.classList.add('completed');

            card.innerHTML = `
                <div class="level-num">Level ${level.id}</div>
                <div class="level-title">${level.name.split(':')[1] || level.name}</div>
                <div class="level-score">${isCompleted ? `Best: ${stats.bestScore} pts` : (isLocked ? '🔒 Locked' : 'Unlocked')}</div>
            `;

            if (!isLocked) {
                card.addEventListener('click', () => {
                    window.gameController.loadLevel(level.id);
                    this.closeLevelSelectModal();
                });
            }

            this.levelGrid.appendChild(card);
        });

        this.levelSelectModal.classList.add('active');
    }

    closeLevelSelectModal() {
        if (this.levelSelectModal) this.levelSelectModal.classList.remove('active');
    }

    openSettingsModal() {
        if (!this.settingsModal) return;
        const settings = window.storageManager.getSettings();

        if (this.soundSetting) this.soundSetting.checked = settings.soundEnabled ?? true;
        if (this.speedSetting) this.speedSetting.value = settings.speed || 'normal';
        if (this.stepModeSetting) this.stepModeSetting.value = settings.stepMode || 'micro';

        this.settingsModal.classList.add('active');
    }

    closeSettingsModal() {
        if (this.settingsModal) this.settingsModal.classList.remove('active');
    }
}

// Global bootstrap on DOM ready
document.addEventListener('DOMContentLoaded', () => {
    window.uiManager = new UIManager();
    window.gameController.init();
});

