# Robot CPU Simulator 🤖⚡

An educational **Computer Organisation and Architecture (COA)** mini-project and retro puzzle game built with **HTML5, CSS3, and Vanilla JavaScript**.

The player writes sequences of CPU instructions to guide a robot across a 5×5 grid, collecting valuable objects, computing arithmetic results in the Arithmetic Logic Unit (ALU), avoiding obstacles, and reaching the destination flag while demonstrating the inner mechanics of the CPU **Fetch → Decode → Execute → Write Back** cycle.

---

## 🎯 Features

- **Pixel-Accurate Retro-Futuristic UI**: Dark cosmic blue aesthetic with glowing cyan, vibrant blue, purple, and emerald green accents matching the reference dashboard.
- **Full CPU Architecture Emulation**:
  - **Program Counter (PC)**: Tracks current instruction address (00–99).
  - **Instruction Register (IR)**: Displays currently fetched opcode and operands.
  - **4-Stage Instruction Cycle**: Visualized across **Fetch**, **Decode**, **Execute**, and **Write Back** with active status indicators and checkmarked execution flow.
  - **General-Purpose Registers (R0, R1, R2, R3)**: Updated dynamically via `LOAD`, `STORE`, `ADD`, and `SUB`.
  - **Arithmetic Logic Unit (ALU)**: Real-time operand displays (`A`, `B`, `Operation`, `Result`) during arithmetic operations.
  - **Data Memory (00–24)**: Dedicated two-column memory bus table (separated from editable instructions) where collected items dynamically store their values and can be accessed with `LOAD` and `STORE`.
- **Robot World (5×5 Grid)**:
  - 25 cells addressed `00` through `24` in row-major order.
  - Robot always begins at `00`; destination flag is always at `24`.
  - **Collectibles**:
    - Diamond 💎 — 5 points (stores `5` at memory address)
    - Battery 🔋 — 10 points (stores `10` at memory address)
    - Magnet 🧲 — 15 points (stores `15` at memory address)
  - **Obstacles**:
    - Wall 🧱, Tree 🌳, Cactus 🌵, Rock 🪨, Bush 🌿.
    - Movement blocking with boundary detection, collision shake, sound effects, and error reporting.
  - **Address Labels Toggle**: Toggle switch in header hides or displays cell address coordinates on demand.
- **Dynamic Program Editor**:
  - Add, modify, or delete instructions.
  - Dropdown selection for opcodes and operands with auto-validation.
  - Real-time row highlight following the active Program Counter (`PC`).
- **10 Progressive Levels**:
  - Progressive learning curve from basic movement to full memory bus loading, register accumulation, and multi-step ALU calculations.
  - Level selection dialog and progress persistence via browser `localStorage`.
- **Execution Controls**:
  - **Run**: Automated execution with configurable speed (Slow 900ms, Normal 450ms, Fast 160ms).
  - **Next Step**: Single-step through each micro-stage (Fetch → Decode → Execute → Write Back) for in-depth COA study.
  - **Pause**: Suspends execution without losing state.
  - **Reset**: Restores current attempt state while keeping unlocked level progression intact.
- **Built-in 8-bit Audio Synthesizer**: Pure Web Audio API procedural sound generation for movement blips, item pickup arpeggios, ALU computation tones, victory fanfares, and collision alarms.

---

## 🛠️ Technology Stack

- **HTML5**: Semantic markup, accessible dialogs, and SVG graphics.
- **CSS3**: Flexbox, CSS Grid, custom scrollbars, animations, responsive design.
- **Vanilla JavaScript (ES6+)**: Pure modular architecture with zero external frameworks or backend dependencies.

---

## 🚀 How to Run

1. Clone or download this repository.
2. Open `index.html` directly in any modern web browser (Google Chrome, Microsoft Edge, Firefox, or Safari).
   - Alternatively, open the folder in VS Code and click **Go Live** with the **Live Server** extension.

---

## 📋 Instruction Set Architecture (ISA) Reference

| Instruction | Operands | Category | Description |
| :--- | :--- | :--- | :--- |
| `MOVE_UP` | None | Movement | Moves the robot one cell up (decrements row). |
| `MOVE_DOWN` | None | Movement | Moves the robot one cell down (increments row). |
| `MOVE_LEFT` | None | Movement | Moves the robot one cell left (decrements column). |
| `MOVE_RIGHT` | None | Movement | Moves the robot one cell right (increments column). |
| `LOAD` | `Rd, [addr]` | Memory | Reads value from Data Memory at `[addr]` into destination register `Rd`. |
| `STORE` | `Rs, [addr]` | Memory | Writes value from source register `Rs` into Data Memory at `[addr]`. |
| `ADD` | `Rd, Rs` | Arithmetic | ALU calculates `Rd = Rd + Rs`. Result stored in `Rd`. |
| `SUB` | `Rd, Rs` | Arithmetic | ALU calculates `Rd = Rd - Rs`. Result stored in `Rd`. |
| `HALT` | None | Control | Cleanly terminates CPU execution. |

---

## 📂 Project Structure

```
Robot_CPU_Simulator/
├── index.html          # Main single-page application markup
├── css/
│   └── style.css       # Complete dark navy theme and UI styles
├── js/
│   ├── audio.js        # Procedural 8-bit sound effects using Web Audio API
│   ├── storage.js      # LocalStorage manager (level progress, settings)
│   ├── levels.js       # Configuration & starter programs for all 10 levels
│   ├── memory.js       # 25-cell Data & Instruction memory management
│   ├── instructions.js # ISA definitions, opcode metadata, and explanations
│   ├── robot.js        # 5x5 grid engine, collision detection, and vector SVGs
│   ├── cpu.js          # Hardware simulation (PC, IR, R0-R3, ALU, Cycle)
│   ├── game.js         # Turn coordinator, run timer, scoring, and level transitions
│   └── main.js         # UI DOM rendering, editor table, and modal events
└── README.md           # Documentation
```

