// ==========================================
// Robot CPU Simulator - Instruction Set Architecture (ISA)
// ==========================================

const REGISTERS = ['R0', 'R1', 'R2', 'R3'];

const INSTRUCTION_SET = {
    MOVE_UP: {
        opcode: 'MOVE_UP',
        category: 'movement',
        operands: 0,
        desc: 'Move the robot one cell up (decrements grid row).',
        needsR1: false,
        needsR2: false
    },
    MOVE_DOWN: {
        opcode: 'MOVE_DOWN',
        category: 'movement',
        operands: 0,
        desc: 'Move the robot one cell down (increments grid row).',
        needsR1: false,
        needsR2: false
    },
    MOVE_LEFT: {
        opcode: 'MOVE_LEFT',
        category: 'movement',
        operands: 0,
        desc: 'Move the robot one cell left (decrements grid column).',
        needsR1: false,
        needsR2: false
    },
    MOVE_RIGHT: {
        opcode: 'MOVE_RIGHT',
        category: 'movement',
        operands: 0,
        desc: 'Move the robot one cell right (increments grid column).',
        needsR1: false,
        needsR2: false
    },
    LOAD: {
        opcode: 'LOAD',
        category: 'memory',
        operands: 2,
        desc: 'Load a value from Data Memory [address] into a destination register.',
        needsR1: true,
        r1Type: 'register',
        needsR2: true,
        r2Type: 'address'
    },
    STORE: {
        opcode: 'STORE',
        category: 'memory',
        operands: 2,
        desc: 'Store a value from a source register into Data Memory [address].',
        needsR1: true,
        r1Type: 'register',
        needsR2: true,
        r2Type: 'address'
    },
    ADD: {
        opcode: 'ADD',
        category: 'arithmetic',
        operands: 2,
        desc: 'ALU performs addition: Rd = Rd + Rs. Result is stored in destination register Rd.',
        needsR1: true,
        r1Type: 'register',
        needsR2: true,
        r2Type: 'register'
    },
    SUB: {
        opcode: 'SUB',
        category: 'arithmetic',
        operands: 2,
        desc: 'ALU performs subtraction: Rd = Rd - Rs. Result is stored in destination register Rd.',
        needsR1: true,
        r1Type: 'register',
        needsR2: true,
        r2Type: 'register'
    },
    HALT: {
        opcode: 'HALT',
        category: 'control',
        operands: 0,
        desc: 'Halt CPU execution and check mission objectives.',
        needsR1: false,
        needsR2: false
    }
};

const InstructionHelper = {
    parseAddress(operandStr) {
        if (!operandStr || operandStr === '-') return null;
        const cleaned = String(operandStr).replace(/[[\]]/g, '').trim();
        const num = parseInt(cleaned, 10);
        return isNaN(num) ? null : num;
    },

    formatAddressOperand(num) {
        if (num === null || num === undefined) return '-';
        return `[${String(num).padStart(2, '0')}]`;
    },

    formatDisplay(instruction) {
        if (!instruction || !instruction.op || instruction.op === '-' || instruction.op === 'SELECT') return '-';
        const op = instruction.op;
        const r1 = instruction.r1 && instruction.r1 !== '-' ? instruction.r1 : '';
        const r2 = instruction.r2 && instruction.r2 !== '-' ? instruction.r2 : '';
        if (r1 && r2) return `${op} ${r1}, ${r2}`;
        if (r1) return `${op} ${r1}`;
        return op;
    },

    getExplanation(inst, stage, cpuState) {
        if (!inst || !inst.op || inst.op === '-' || inst.op === 'SELECT') {
            return {
                title: '-',
                details: 'No instruction executed yet. Select instructions from the dropdowns.',
                stageText: 'Ready'
            };
        }

        const op = inst.op;
        const meta = INSTRUCTION_SET[op] || {};
        const r1 = inst.r1 || '-';
        const r2 = inst.r2 || '-';
        const display = this.formatDisplay(inst);

        switch (stage) {
            case 'FETCH':
                return {
                    title: display,
                    details: `FETCH: Retrieved instruction "${display}" from Program Memory at address PC: ${String(cpuState.pc).padStart(2, '0')} into Instruction Register (IR).`,
                    stageText: 'Fetch'
                };
            case 'DECODE':
                let decodeDetail = `DECODE: Control Unit identifies opcode ${op}.`;
                if (meta.category === 'movement') {
                    decodeDetail += ` Preparing motor controller for grid translation.`;
                } else if (meta.category === 'memory') {
                    decodeDetail += ` Directing memory bus for address ${r2} and register ${r1}.`;
                } else if (meta.category === 'arithmetic') {
                    decodeDetail += ` Routing registers ${r1} and ${r2} as inputs to the ALU.`;
                } else if (meta.category === 'control') {
                    decodeDetail += ` Preparing to suspend clock signals.`;
                }
                return {
                    title: display,
                    details: decodeDetail,
                    stageText: 'Decode'
                };
            case 'EXECUTE':
                let execDetail = `EXECUTE: `;
                if (meta.category === 'movement') {
                    execDetail += `Actuating robot movement ${op}. Checking grid boundaries and obstacles.`;
                } else if (op === 'LOAD') {
                    const addr = this.parseAddress(r2);
                    const val = addr !== null ? (window.cpuMemory.data[addr] ?? 0) : 0;
                    execDetail += `Reading value (${val}) from Data Memory [${String(addr).padStart(2, '0')}].`;
                } else if (op === 'STORE') {
                    const regVal = cpuState.registers[r1] ?? 0;
                    execDetail += `Writing value (${regVal}) from register ${r1} to Data Memory ${r2}.`;
                } else if (op === 'ADD') {
                    const a = cpuState.registers[r1] ?? 0;
                    const b = cpuState.registers[r2] ?? 0;
                    execDetail += `ALU calculates: ${a} + ${b} = ${a + b}.`;
                } else if (op === 'SUB') {
                    const a = cpuState.registers[r1] ?? 0;
                    const b = cpuState.registers[r2] ?? 0;
                    execDetail += `ALU calculates: ${a} - ${b} = ${a - b}.`;
                } else if (op === 'HALT') {
                    execDetail += `Program execution halted. Evaluating final position and score.`;
                }
                return {
                    title: display,
                    details: execDetail,
                    stageText: 'Execute'
                };
            case 'WRITE_BACK':
                let wbDetail = `WRITE BACK: `;
                if (op === 'LOAD') {
                    wbDetail += `Value latched into register ${r1}. PC advanced.`;
                } else if (op === 'STORE') {
                    wbDetail += `Data Memory updated successfully. PC advanced.`;
                } else if (op === 'ADD' || op === 'SUB') {
                    wbDetail += `ALU result latched into destination register ${r1}. PC advanced.`;
                } else if (op === 'HALT') {
                    wbDetail += `Registers and memory finalized. Execution complete.`;
                } else {
                    wbDetail += `Robot position updated on grid. PC advanced to next instruction.`;
                }
                return {
                    title: display,
                    details: wbDetail,
                    stageText: 'Write Back'
                };
            default:
                return {
                    title: display,
                    details: meta.desc || '',
                    stageText: stage
                };
        }
    }
};

window.REGISTERS = REGISTERS;
window.INSTRUCTION_SET = INSTRUCTION_SET;
window.InstructionHelper = InstructionHelper;

