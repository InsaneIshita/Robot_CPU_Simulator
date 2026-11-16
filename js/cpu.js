// ==========================================
// Robot CPU Simulator - CPU Hardware Engine
// ==========================================

const CPU_STAGES = {
    FETCH: 'FETCH',
    DECODE: 'DECODE',
    EXECUTE: 'EXECUTE',
    WRITE_BACK: 'WRITE_BACK'
};

class CPU {
    constructor() {
        this.pc = 0; // Program Counter (00 - 99)
        this.ir = null; // Instruction Register
        this.currentStage = CPU_STAGES.FETCH;
        this.registers = { R0: 0, R1: 0, R2: 0, R3: 0 };
        this.alu = {
            operandA: null,
            operandB: null,
            operation: null,
            result: null,
            displayText: '-'
        };
        this.decodedInstruction = null;
        this.executionPendingResult = null;
        this.isHalted = false;
        this.hasError = false;
        this.errorMessage = '';
        this.cycleCount = 0;
        this.instructionCount = 0;
    }

    reset() {
        this.pc = 0;
        this.ir = null;
        this.currentStage = CPU_STAGES.FETCH;
        this.registers = { R0: 0, R1: 0, R2: 0, R3: 0 };
        this.alu = {
            operandA: null,
            operandB: null,
            operation: null,
            result: null,
            displayText: '-'
        };
        this.decodedInstruction = null;
        this.executionPendingResult = null;
        this.isHalted = false;
        this.hasError = false;
        this.errorMessage = '';
        this.cycleCount = 0;
        this.instructionCount = 0;
    }

    // Single Micro-Step in the Fetch-Decode-Execute-WriteBack pipeline
    stepCycle(program) {
        if (this.isHalted) {
            return {
                finished: true,
                message: 'CPU is currently HALTED. Click Reset to start again.'
            };
        }

        switch (this.currentStage) {
            case CPU_STAGES.FETCH:
                return this._fetchStage(program);

            case CPU_STAGES.DECODE:
                return this._decodeStage();

            case CPU_STAGES.EXECUTE:
                return this._executeStage();

            case CPU_STAGES.WRITE_BACK:
                return this._writeBackStage(program);

            default:
                this.currentStage = CPU_STAGES.FETCH;
                return { success: false, message: 'Unknown stage' };
        }
    }

    // Stage 1: FETCH
    _fetchStage(program) {
        if (!program || program.length === 0) {
            this.isHalted = true;
            this.hasError = true;
            this.errorMessage = 'No program loaded in Program Editor.';
            return { success: false, stage: 'FETCH', error: this.errorMessage };
        }

        if (this.pc >= program.length) {
            // Implicit HALT if program counter exceeds instructions
            this.isHalted = true;
            return {
                success: true,
                stage: 'FETCH',
                finished: true,
                message: 'Program Counter reached end of instructions. Execution stopped.'
            };
        }

        // Fetch instruction from program memory at address PC
        const instruction = program[this.pc];
        this.ir = JSON.parse(JSON.stringify(instruction));
        this.decodedInstruction = null;
        this.executionPendingResult = null;
        this.currentStage = CPU_STAGES.DECODE;
        this.cycleCount++;

        return {
            success: true,
            stage: 'FETCH',
            pc: this.pc,
            ir: this.ir,
            message: `Fetched instruction #${String(this.pc).padStart(2, '0')}: ${window.InstructionHelper.formatDisplay(this.ir)}`
        };
    }

    // Stage 2: DECODE
    _decodeStage() {
        if (!this.ir || !this.ir.op || this.ir.op === '-' || this.ir.op === 'SELECT') {
            this.isHalted = true;
            this.hasError = true;
            this.errorMessage = `Instruction #${String(this.pc).padStart(2, '0')} is not set. Please select an instruction from the dropdown.`;
            return { success: false, stage: 'DECODE', error: this.errorMessage, message: this.errorMessage };
        }

        const op = this.ir.op;
        const meta = window.INSTRUCTION_SET[op];

        if (!meta) {
            this.isHalted = true;
            this.hasError = true;
            this.errorMessage = `Unknown opcode "${op}" at PC ${String(this.pc).padStart(2, '0')}`;
            return { success: false, stage: 'DECODE', error: this.errorMessage };
        }

        this.decodedInstruction = {
            op: op,
            meta: meta,
            r1: this.ir.r1,
            r2: this.ir.r2
        };

        this.currentStage = CPU_STAGES.EXECUTE;
        this.cycleCount++;

        return {
            success: true,
            stage: 'DECODE',
            pc: this.pc,
            ir: this.ir,
            decoded: this.decodedInstruction,
            message: `Decoded opcode ${op}. Preparing control signals.`
        };
    }

    // Stage 3: EXECUTE
    _executeStage() {
        const decoded = this.decodedInstruction;
        if (!decoded) {
            this.isHalted = true;
            return { success: false, stage: 'EXECUTE', error: 'No decoded instruction available.' };
        }

        const op = decoded.op;
        let execResult = {
            success: true,
            type: decoded.meta.category,
            details: ''
        };

        if (decoded.meta.category === 'movement') {
            // Movement operation executed in Robot World
            const moveRes = window.robotWorld.move(op);
            execResult.moveResult = moveRes;
            execResult.success = moveRes.success;
            execResult.details = moveRes.message;
            this.executionPendingResult = { type: 'movement', moveRes: moveRes };
        } else if (op === 'LOAD') {
            const addr = window.InstructionHelper.parseAddress(decoded.r2);
            if (addr === null || addr < 0 || addr > 24) {
                execResult.success = false;
                execResult.details = `Invalid memory address "${decoded.r2}" for LOAD. Must be [00] to [24].`;
            } else {
                const val = window.cpuMemory.read(addr);
                this.executionPendingResult = {
                    type: 'register_write',
                    reg: decoded.r1,
                    value: val,
                    sourceAddr: addr
                };
                execResult.details = `Memory Bus read Data Memory [${String(addr).padStart(2, '0')}] = ${val}.`;
            }
        } else if (op === 'STORE') {
            const addr = window.InstructionHelper.parseAddress(decoded.r2);
            const reg = decoded.r1;
            if (addr === null || addr < 0 || addr > 24) {
                execResult.success = false;
                execResult.details = `Invalid memory address "${decoded.r2}" for STORE. Must be [00] to [24].`;
            } else if (!REGISTERS.includes(reg)) {
                execResult.success = false;
                execResult.details = `Invalid register "${reg}" for STORE.`;
            } else {
                const val = this.registers[reg] ?? 0;
                this.executionPendingResult = {
                    type: 'memory_write',
                    addr: addr,
                    value: val,
                    sourceReg: reg
                };
                execResult.details = `Data Bus prepared to store value (${val}) from ${reg} to Memory [${String(addr).padStart(2, '0')}].`;
            }
        } else if (op === 'ADD' || op === 'SUB') {
            const reg1 = decoded.r1;
            const reg2 = decoded.r2;

            if (!REGISTERS.includes(reg1) || !REGISTERS.includes(reg2)) {
                execResult.success = false;
                execResult.details = `Invalid arithmetic operands: ${reg1}, ${reg2}.`;
            } else {
                const a = this.registers[reg1] ?? 0;
                const b = this.registers[reg2] ?? 0;
                let res = 0;

                if (op === 'ADD') {
                    res = a + b;
                    this.alu = {
                        operandA: a,
                        operandB: b,
                        operation: 'ADD',
                        result: res,
                        displayText: `A=${a}  B=${b}  [ADD]  Res=${res}`
                    };
                } else {
                    res = a - b;
                    this.alu = {
                        operandA: a,
                        operandB: b,
                        operation: 'SUB',
                        result: res,
                        displayText: `A=${a}  B=${b}  [SUB]  Res=${res}`
                    };
                }

                this.executionPendingResult = {
                    type: 'alu_write',
                    destReg: reg1,
                    value: res,
                    alu: this.alu
                };

                if (window.soundManager) window.soundManager.playAlu();
                execResult.details = `ALU computation: ${this.alu.displayText}`;
            }
        } else if (op === 'HALT') {
            this.executionPendingResult = { type: 'halt' };
            execResult.details = 'HALT instruction executed. Preparing system shutdown.';
        }

        this.currentStage = CPU_STAGES.WRITE_BACK;
        this.cycleCount++;

        return {
            success: execResult.success,
            stage: 'EXECUTE',
            pc: this.pc,
            ir: this.ir,
            execResult: execResult,
            message: execResult.details
        };
    }

    // Stage 4: WRITE_BACK
    _writeBackStage(program) {
        const pending = this.executionPendingResult;
        let wbMessage = '';

        if (pending) {
            if (pending.type === 'register_write') {
                if (REGISTERS.includes(pending.reg)) {
                    this.registers[pending.reg] = pending.value;
                    wbMessage = `Latched ${pending.value} into register ${pending.reg}.`;
                }
            } else if (pending.type === 'alu_write') {
                if (REGISTERS.includes(pending.destReg)) {
                    this.registers[pending.destReg] = pending.value;
                    wbMessage = `Latched ALU result (${pending.value}) into ${pending.destReg}.`;
                }
            } else if (pending.type === 'memory_write') {
                window.cpuMemory.write(pending.addr, pending.value);
                wbMessage = `Wrote ${pending.value} from ${pending.sourceReg} into Data Memory [${String(pending.addr).padStart(2, '0')}].`;
            } else if (pending.type === 'movement') {
                wbMessage = `Grid position updated.`;
            } else if (pending.type === 'halt') {
                this.isHalted = true;
                wbMessage = `CPU execution halted cleanly.`;
            }
        }

        this.instructionCount++;

        // Advance Program Counter if not halted
        if (!this.isHalted) {
            this.pc++;
            // Check if end of program
            if (this.pc >= program.length) {
                this.isHalted = true;
                wbMessage += ' Reached end of program instructions.';
            }
        }

        // Ready for next instruction
        this.currentStage = CPU_STAGES.FETCH;
        this.cycleCount++;

        return {
            success: true,
            stage: 'WRITE_BACK',
            pc: this.pc,
            ir: this.ir,
            finished: this.isHalted,
            message: wbMessage || 'Write Back complete. PC updated.'
        };
    }
}

window.cpu = new CPU();
window.CPU_STAGES = CPU_STAGES;

