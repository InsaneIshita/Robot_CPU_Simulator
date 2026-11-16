// ==========================================
// Robot CPU Simulator - Robot & Grid Engine
// ==========================================

class RobotWorld {
    constructor() {
        this.size = 5;
        this.totalCells = 25;
        this.robotRow = 0;
        this.robotCol = 0;
        this.flagAddress = 24;
        this.collectibles = []; // active remaining collectibles in current run
        this.collectedItems = []; // items collected in current run
        this.obstacles = [];
        this.collisionCell = null;
        this.lastMoveSuccess = true;
        this.lastMoveMessage = '';
    }

    init(levelData) {
        this.robotRow = 0;
        this.robotCol = 0;
        this.flagAddress = 24;
        this.collectibles = JSON.parse(JSON.stringify(levelData.collectibles || []));
        this.collectedItems = [];
        this.obstacles = JSON.parse(JSON.stringify(levelData.obstacles || []));
        this.collisionCell = null;
        this.lastMoveSuccess = true;
        this.lastMoveMessage = '';
    }

    reset(levelData) {
        this.init(levelData);
    }

    get currentAddress() {
        return this.robotRow * this.size + this.robotCol;
    }

    coordsToAddress(r, c) {
        return r * this.size + c;
    }

    addressToCoords(addr) {
        return {
            row: Math.floor(addr / this.size),
            col: addr % this.size
        };
    }

    isObstacleAt(addr) {
        return this.obstacles.find(o => o.address === addr);
    }

    getCollectibleAt(addr) {
        return this.collectibles.find(c => c.address === addr);
    }

    move(direction) {
        let newRow = this.robotRow;
        let newCol = this.robotCol;

        switch (direction) {
            case 'UP':
            case 'MOVE_UP':
                newRow--;
                break;
            case 'DOWN':
            case 'MOVE_DOWN':
                newRow++;
                break;
            case 'LEFT':
            case 'MOVE_LEFT':
                newCol--;
                break;
            case 'RIGHT':
            case 'MOVE_RIGHT':
                newCol++;
                break;
            default:
                return { success: false, reason: 'unknown_direction' };
        }

        // Boundary check
        if (newRow < 0 || newRow >= this.size || newCol < 0 || newCol >= this.size) {
            this.lastMoveSuccess = false;
            this.collisionCell = this.currentAddress;
            this.lastMoveMessage = `Boundary reached! Robot cannot move outside the 5×5 grid.`;
            if (window.soundManager) window.soundManager.playError();
            return {
                success: false,
                reason: 'boundary',
                address: this.currentAddress,
                message: this.lastMoveMessage
            };
        }

        const targetAddr = this.coordsToAddress(newRow, newCol);

        // Obstacle check
        const obstacle = this.isObstacleAt(targetAddr);
        if (obstacle) {
            this.lastMoveSuccess = false;
            this.collisionCell = targetAddr;
            const obsName = obstacle.type.charAt(0).toUpperCase() + obstacle.type.slice(1);
            this.lastMoveMessage = `Movement blocked! ${obsName} at cell [${String(targetAddr).padStart(2, '0')}].`;
            if (window.soundManager) window.soundManager.playError();
            return {
                success: false,
                reason: 'obstacle',
                obstacle: obstacle,
                address: targetAddr,
                message: this.lastMoveMessage
            };
        }

        // Valid move
        this.robotRow = newRow;
        this.robotCol = newCol;
        this.collisionCell = null;
        this.lastMoveSuccess = true;
        this.lastMoveMessage = `Moved to cell [${String(targetAddr).padStart(2, '0')}].`;

        if (window.soundManager) window.soundManager.playMove();

        // Check for collectible pickup
        let collected = null;
        const colIdx = this.collectibles.findIndex(c => c.address === targetAddr);
        if (colIdx !== -1) {
            collected = this.collectibles[colIdx];
            this.collectibles.splice(colIdx, 1);
            this.collectedItems.push(collected);

            // Store value in Data Memory at target address
            if (window.cpuMemory) {
                window.cpuMemory.write(targetAddr, collected.value);
            }

            if (window.soundManager) window.soundManager.playCollect();
            this.lastMoveMessage += ` Collected ${collected.type.toUpperCase()} (+${collected.value} pts)! Stored in Data Memory [${String(targetAddr).padStart(2, '0')}].`;
        }

        const isAtDestination = (targetAddr === this.flagAddress);

        return {
            success: true,
            newAddress: targetAddr,
            collected: collected,
            isAtDestination: isAtDestination,
            message: this.lastMoveMessage
        };
    }
}

// SVG Graphic Generators for visual fidelity matching screenshot
const GridIcons = {
    robot() {
        return `
        <svg class="grid-icon robot-icon-svg" viewBox="0 0 100 100" width="100%" height="100%">
            <defs>
                <linearGradient id="roboHeadGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stop-color="#38bdf8"/>
                    <stop offset="100%" stop-color="#0284c7"/>
                </linearGradient>
                <linearGradient id="roboBodyGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stop-color="#e0f2fe"/>
                    <stop offset="100%" stop-color="#bae6fd"/>
                </linearGradient>
                <filter id="roboGlow" x="-20%" y="-20%" width="140%" height="140%">
                    <feGaussianBlur stdDeviation="3" result="blur" />
                    <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>
            </defs>
            <!-- Antenna -->
            <line x1="50" y1="20" x2="50" y2="8" stroke="#38bdf8" stroke-width="4" stroke-linecap="round"/>
            <circle cx="50" cy="8" r="5" fill="#38bdf8" filter="url(#roboGlow)"/>
            
            <!-- Ears / Side bolts -->
            <rect x="16" y="32" width="6" height="14" rx="3" fill="#0284c7"/>
            <rect x="78" y="32" width="6" height="14" rx="3" fill="#0284c7"/>

            <!-- Head Outer Box -->
            <rect x="20" y="18" width="60" height="46" rx="14" fill="#0c1e3d" stroke="#38bdf8" stroke-width="3.5" filter="url(#roboGlow)"/>
            
            <!-- Face Screen -->
            <rect x="25" y="23" width="50" height="36" rx="9" fill="#061224"/>
            
            <!-- Eyes (Glowing Cyan) -->
            <rect x="32" y="32" width="11" height="13" rx="4" fill="#38bdf8" filter="url(#roboGlow)"/>
            <rect x="57" y="32" width="11" height="13" rx="4" fill="#38bdf8" filter="url(#roboGlow)"/>
            
            <!-- Eye Highlights -->
            <circle cx="35" cy="35" r="2" fill="#ffffff"/>
            <circle cx="60" cy="35" r="2" fill="#ffffff"/>

            <!-- Smile -->
            <path d="M42 49 Q50 54 58 49" stroke="#38bdf8" stroke-width="2.5" stroke-linecap="round" fill="none"/>

            <!-- Body Neck & Shoulders -->
            <rect x="42" y="65" width="16" height="7" rx="2" fill="#0284c7"/>
            <path d="M28 72 L72 72 L78 92 L22 92 Z" fill="#0c1e3d" stroke="#38bdf8" stroke-width="3" rx="4"/>
            <circle cx="50" cy="82" r="4.5" fill="#38bdf8" filter="url(#roboGlow)"/>
        </svg>`;
    },

    diamond() {
        return `
        <svg class="grid-icon item-diamond" viewBox="0 0 100 100" width="100%" height="100%">
            <defs>
                <linearGradient id="diamondGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stop-color="#67e8f9"/>
                    <stop offset="50%" stop-color="#38bdf8"/>
                    <stop offset="100%" stop-color="#2563eb"/>
                </linearGradient>
                <filter id="gemGlow" x="-20%" y="-20%" width="140%" height="140%">
                    <feGaussianBlur stdDeviation="3.5" result="blur"/>
                    <feComposite in="SourceGraphic" in2="blur" operator="over"/>
                </filter>
            </defs>
            <polygon points="50,15 82,38 50,85 18,38" fill="url(#diamondGrad)" filter="url(#gemGlow)"/>
            <polygon points="50,15 65,38 50,85 35,38" fill="#bae6fd" opacity="0.6"/>
            <polygon points="50,15 82,38 65,38" fill="#ffffff" opacity="0.7"/>
            <polygon points="50,15 18,38 35,38" fill="#e0f2fe" opacity="0.4"/>
            <line x1="18" y1="38" x2="82" y2="38" stroke="#ffffff" stroke-width="1.5" opacity="0.8"/>
        </svg>`;
    },

    battery() {
        return `
        <svg class="grid-icon item-battery" viewBox="0 0 100 100" width="100%" height="100%">
            <defs>
                <linearGradient id="batteryGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stop-color="#34d399"/>
                    <stop offset="100%" stop-color="#059669"/>
                </linearGradient>
                <filter id="batGlow" x="-20%" y="-20%" width="140%" height="140%">
                    <feGaussianBlur stdDeviation="3.5" result="blur"/>
                    <feComposite in="SourceGraphic" in2="blur" operator="over"/>
                </filter>
            </defs>
            <!-- Battery Terminal Cap -->
            <rect x="42" y="14" width="16" height="6" rx="2" fill="#10b981" filter="url(#batGlow)"/>
            <!-- Battery Body -->
            <rect x="28" y="20" width="44" height="64" rx="9" fill="#06281e" stroke="#10b981" stroke-width="3.5" filter="url(#batGlow)"/>
            <!-- Energy Level Inside -->
            <rect x="33" y="26" width="34" height="52" rx="5" fill="url(#batteryGrad)" opacity="0.9"/>
            <!-- Lightning Bolt -->
            <path d="M53 32 L40 54 L50 54 L46 72 L62 48 L51 48 Z" fill="#ffffff" filter="url(#batGlow)"/>
        </svg>`;
    },

    magnet() {
        return `
        <svg class="grid-icon item-magnet" viewBox="0 0 100 100" width="100%" height="100%">
            <defs>
                <filter id="magGlow" x="-20%" y="-20%" width="140%" height="140%">
                    <feGaussianBlur stdDeviation="3" result="blur"/>
                    <feComposite in="SourceGraphic" in2="blur" operator="over"/>
                </filter>
            </defs>
            <!-- Horseshoe Magnet Arc -->
            <path d="M25 80 L25 45 A25 25 0 0 1 75 45 L75 80 L61 80 L61 45 A11 11 0 0 0 39 45 L39 80 Z" fill="#ef4444" filter="url(#magGlow)"/>
            <!-- Silver Poles -->
            <rect x="25" y="66" width="14" height="14" fill="#e2e8f0" stroke="#94a3b8" stroke-width="1.5"/>
            <rect x="61" y="66" width="14" height="14" fill="#e2e8f0" stroke="#94a3b8" stroke-width="1.5"/>
            <!-- Pole Labels N and S -->
            <text x="32" y="77" font-size="9" font-weight="bold" fill="#0f172a" text-anchor="middle">N</text>
            <text x="68" y="77" font-size="9" font-weight="bold" fill="#0f172a" text-anchor="middle">S</text>
            <!-- Sparks / Magnetic Waves -->
            <path d="M32 87 Q50 96 68 87" fill="none" stroke="#38bdf8" stroke-width="2.5" stroke-dasharray="3,2" filter="url(#magGlow)"/>
        </svg>`;
    },

    flag() {
        return `
        <svg class="grid-icon destination-flag" viewBox="0 0 100 100" width="100%" height="100%">
            <defs>
                <filter id="flagGlow" x="-20%" y="-20%" width="140%" height="140%">
                    <feGaussianBlur stdDeviation="2.5" result="blur"/>
                    <feComposite in="SourceGraphic" in2="blur" operator="over"/>
                </filter>
            </defs>
            <!-- Flag Pole -->
            <line x1="28" y1="20" x2="28" y2="85" stroke="#94a3b8" stroke-width="4" stroke-linecap="round"/>
            <circle cx="28" cy="18" r="4" fill="#fbbf24"/>
            <!-- Circular Base -->
            <ellipse cx="28" cy="85" rx="14" ry="4" fill="#475569"/>
            <!-- Checkered Flag Banner -->
            <path d="M30 22 C45 18 55 26 76 22 L76 56 C55 60 45 52 30 56 Z" fill="#ffffff" stroke="#cbd5e1" stroke-width="1.5" filter="url(#flagGlow)"/>
            <!-- Checkered squares -->
            <path d="M30 22 C37 20 42 23 48 22 L48 39 C42 40 37 38 30 39 Z" fill="#0f172a"/>
            <path d="M48 22 C55 21 62 25 76 22 L76 39 C62 42 55 38 48 39 Z" fill="#ffffff"/>
            <path d="M30 39 C37 38 42 41 48 40 L48 56 C42 58 37 55 30 56 Z" fill="#ffffff"/>
            <path d="M48 40 C55 39 62 43 76 39 L76 56 C62 60 55 57 48 56 Z" fill="#0f172a"/>
        </svg>`;
    },

    wall() {
        return `
        <svg class="grid-icon obstacle-wall" viewBox="0 0 100 100" width="100%" height="100%">
            <rect x="12" y="16" width="76" height="68" rx="8" fill="#1e293b" stroke="#3b82f6" stroke-width="2.5"/>
            <!-- Brick Pattern Lines -->
            <line x1="12" y1="38" x2="88" y2="38" stroke="#3b82f6" stroke-width="2"/>
            <line x1="12" y1="62" x2="88" y2="62" stroke="#3b82f6" stroke-width="2"/>
            <line x1="50" y1="16" x2="50" y2="38" stroke="#3b82f6" stroke-width="2"/>
            <line x1="32" y1="38" x2="32" y2="62" stroke="#3b82f6" stroke-width="2"/>
            <line x1="68" y1="38" x2="68" y2="62" stroke="#3b82f6" stroke-width="2"/>
            <line x1="50" y1="62" x2="50" y2="84" stroke="#3b82f6" stroke-width="2"/>
        </svg>`;
    },

    tree() {
        return `
        <svg class="grid-icon obstacle-tree" viewBox="0 0 100 100" width="100%" height="100%">
            <!-- Trunk -->
            <rect x="44" y="65" width="12" height="20" rx="3" fill="#854d0e"/>
            <!-- Leaves (3 tiers) -->
            <polygon points="50,15 22,48 78,48" fill="#15803d" stroke="#22c55e" stroke-width="1.5"/>
            <polygon points="50,30 26,60 74,60" fill="#166534" stroke="#22c55e" stroke-width="1.5"/>
            <polygon points="50,45 30,72 70,72" fill="#14532d" stroke="#22c55e" stroke-width="1.5"/>
        </svg>`;
    },

    cactus() {
        return `
        <svg class="grid-icon obstacle-cactus" viewBox="0 0 100 100" width="100%" height="100%">
            <!-- Main Trunk -->
            <rect x="43" y="20" width="14" height="65" rx="7" fill="#16a34a" stroke="#4ade80" stroke-width="2"/>
            <!-- Left Arm -->
            <path d="M22 45 L32 45 A4 4 0 0 1 36 49 L36 58 A4 4 0 0 1 32 62 L43 62" fill="none" stroke="#16a34a" stroke-width="11" stroke-linecap="round"/>
            <path d="M22 45 L32 45 A4 4 0 0 1 36 49 L36 58 A4 4 0 0 1 32 62 L43 62" fill="none" stroke="#4ade80" stroke-width="2" stroke-linecap="round"/>
            <!-- Right Arm -->
            <path d="M78 35 L68 35 A4 4 0 0 0 64 39 L64 48 A4 4 0 0 0 68 52 L57 52" fill="none" stroke="#16a34a" stroke-width="11" stroke-linecap="round"/>
            <path d="M78 35 L68 35 A4 4 0 0 0 64 39 L64 48 A4 4 0 0 0 68 52 L57 52" fill="none" stroke="#4ade80" stroke-width="2" stroke-linecap="round"/>
        </svg>`;
    },

    rock() {
        return `
        <svg class="grid-icon obstacle-rock" viewBox="0 0 100 100" width="100%" height="100%">
            <!-- Faceted Boulder -->
            <polygon points="32,24 68,20 86,45 78,80 26,82 14,52" fill="#475569" stroke="#94a3b8" stroke-width="2.5"/>
            <polygon points="32,24 68,20 54,48 26,82 14,52" fill="#334155"/>
            <polygon points="68,20 86,45 78,80 54,48" fill="#64748b"/>
        </svg>`;
    },

    bush() {
        return `
        <svg class="grid-icon obstacle-bush" viewBox="0 0 100 100" width="100%" height="100%">
            <ellipse cx="50" cy="58" rx="34" ry="24" fill="#15803d" stroke="#22c55e" stroke-width="2"/>
            <circle cx="36" cy="46" r="18" fill="#16a34a" stroke="#4ade80" stroke-width="1.5"/>
            <circle cx="64" cy="46" r="18" fill="#16a34a" stroke="#4ade80" stroke-width="1.5"/>
            <circle cx="50" cy="38" r="19" fill="#22c55e" stroke="#86efac" stroke-width="1.5"/>
        </svg>`;
    }
};

window.robotWorld = new RobotWorld();
window.GridIcons = GridIcons;

