// ==========================================
// Robot CPU Simulator - Level Configurations
// ==========================================

const LEVELS_DATA = [
    {
        "id": 1,
        "name": "Level 1: Basic Movement & Collectibles",
        "description": "Move the robot, collect the Diamond and Battery, and reach the destination flag at 24.",
        "hint": "Collectibles store their values in Data Memory when gathered. Use LOAD to copy their values into CPU registers!",
        "collectibles": [
            {
                "address": 11,
                "type": "diamond",
                "value": 5
            },
            {
                "address": 16,
                "type": "battery",
                "value": 10
            }
        ],
        "obstacles": [],
        "starterProgram": [
            {
                "op": "MOVE_DOWN",
                "r1": "-",
                "r2": "-"
            },
            {
                "op": "MOVE_DOWN",
                "r1": "-",
                "r2": "-"
            },
            {
                "op": "MOVE_RIGHT",
                "r1": "-",
                "r2": "-"
            },
            {
                "op": "LOAD",
                "r1": "R1",
                "r2": "[11]"
            },
            {
                "op": "MOVE_DOWN",
                "r1": "-",
                "r2": "-"
            },
            {
                "op": "LOAD",
                "r1": "R2",
                "r2": "[16]"
            },
            {
                "op": "ADD",
                "r1": "R1",
                "r2": "R2"
            },
            {
                "op": "MOVE_DOWN",
                "r1": "-",
                "r2": "-"
            },
            {
                "op": "MOVE_RIGHT",
                "r1": "-",
                "r2": "-"
            },
            {
                "op": "MOVE_RIGHT",
                "r1": "-",
                "r2": "-"
            },
            {
                "op": "MOVE_RIGHT",
                "r1": "-",
                "r2": "-"
            },
            {
                "op": "HALT",
                "r1": "-",
                "r2": "-"
            }
        ]
    },
    {
        "id": 2,
        "name": "Level 2: Obstacle Navigation",
        "description": "A wall and rock block your path. Navigate around the obstacles to reach the flag.",
        "hint": "The robot cannot step into obstacle cells. Plan your route around them!",
        "collectibles": [
            {
                "address": 2,
                "type": "diamond",
                "value": 5
            },
            {
                "address": 22,
                "type": "battery",
                "value": 10
            }
        ],
        "obstacles": [
            {
                "address": 7,
                "type": "wall"
            },
            {
                "address": 17,
                "type": "rock"
            }
        ],
        "starterProgram": [
            {
                "op": "-",
                "r1": "-",
                "r2": "-"
            },
            {
                "op": "-",
                "r1": "-",
                "r2": "-"
            },
            {
                "op": "-",
                "r1": "-",
                "r2": "-"
            },
            {
                "op": "-",
                "r1": "-",
                "r2": "-"
            },
            {
                "op": "-",
                "r1": "-",
                "r2": "-"
            },
            {
                "op": "-",
                "r1": "-",
                "r2": "-"
            },
            {
                "op": "-",
                "r1": "-",
                "r2": "-"
            },
            {
                "op": "-",
                "r1": "-",
                "r2": "-"
            },
            {
                "op": "-",
                "r1": "-",
                "r2": "-"
            },
            {
                "op": "-",
                "r1": "-",
                "r2": "-"
            },
            {
                "op": "-",
                "r1": "-",
                "r2": "-"
            },
            {
                "op": "-",
                "r1": "-",
                "r2": "-"
            }
        ]
    },
    {
        "id": 3,
        "name": "Level 3: Memory Load & Register R1",
        "description": "Collect two diamonds and practice loading their values into register R1 and R2.",
        "hint": "Address numbers are always 2-digits. Use LOAD Rd, [addr] where addr matches the cell address.",
        "collectibles": [
            {
                "address": 6,
                "type": "diamond",
                "value": 5
            },
            {
                "address": 18,
                "type": "diamond",
                "value": 5
            }
        ],
        "obstacles": [
            {
                "address": 1,
                "type": "cactus"
            },
            {
                "address": 12,
                "type": "bush"
            },
            {
                "address": 21,
                "type": "tree"
            }
        ],
        "starterProgram": [
            {
                "op": "-",
                "r1": "-",
                "r2": "-"
            },
            {
                "op": "-",
                "r1": "-",
                "r2": "-"
            },
            {
                "op": "-",
                "r1": "-",
                "r2": "-"
            },
            {
                "op": "-",
                "r1": "-",
                "r2": "-"
            },
            {
                "op": "-",
                "r1": "-",
                "r2": "-"
            },
            {
                "op": "-",
                "r1": "-",
                "r2": "-"
            },
            {
                "op": "-",
                "r1": "-",
                "r2": "-"
            },
            {
                "op": "-",
                "r1": "-",
                "r2": "-"
            },
            {
                "op": "-",
                "r1": "-",
                "r2": "-"
            },
            {
                "op": "-",
                "r1": "-",
                "r2": "-"
            },
            {
                "op": "-",
                "r1": "-",
                "r2": "-"
            },
            {
                "op": "-",
                "r1": "-",
                "r2": "-"
            }
        ]
    },
    {
        "id": 4,
        "name": "Level 4: Registers & Accumulation",
        "description": "Collect the diamond and battery. Use CPU registers to hold each value before adding.",
        "hint": "Use R0 to R3 to hold intermediate results during execution.",
        "collectibles": [
            {
                "address": 8,
                "type": "diamond",
                "value": 5
            },
            {
                "address": 13,
                "type": "battery",
                "value": 10
            }
        ],
        "obstacles": [
            {
                "address": 7,
                "type": "wall"
            },
            {
                "address": 14,
                "type": "wall"
            },
            {
                "address": 19,
                "type": "rock"
            }
        ],
        "starterProgram": [
            {
                "op": "-",
                "r1": "-",
                "r2": "-"
            },
            {
                "op": "-",
                "r1": "-",
                "r2": "-"
            },
            {
                "op": "-",
                "r1": "-",
                "r2": "-"
            },
            {
                "op": "-",
                "r1": "-",
                "r2": "-"
            },
            {
                "op": "-",
                "r1": "-",
                "r2": "-"
            },
            {
                "op": "-",
                "r1": "-",
                "r2": "-"
            },
            {
                "op": "-",
                "r1": "-",
                "r2": "-"
            },
            {
                "op": "-",
                "r1": "-",
                "r2": "-"
            },
            {
                "op": "-",
                "r1": "-",
                "r2": "-"
            },
            {
                "op": "-",
                "r1": "-",
                "r2": "-"
            },
            {
                "op": "-",
                "r1": "-",
                "r2": "-"
            },
            {
                "op": "-",
                "r1": "-",
                "r2": "-"
            }
        ]
    },
    {
        "id": 5,
        "name": "Level 5: The Magnet & ALU Addition",
        "description": "The magnet is worth 15 points! Collect it along with the battery and compute their sum.",
        "hint": "Watch the ALU section light up during the ADD instruction execution!",
        "collectibles": [
            {
                "address": 4,
                "type": "battery",
                "value": 10
            },
            {
                "address": 12,
                "type": "magnet",
                "value": 15
            }
        ],
        "obstacles": [
            {
                "address": 2,
                "type": "bush"
            },
            {
                "address": 17,
                "type": "cactus"
            },
            {
                "address": 22,
                "type": "wall"
            }
        ],
        "starterProgram": [
            {
                "op": "-",
                "r1": "-",
                "r2": "-"
            },
            {
                "op": "-",
                "r1": "-",
                "r2": "-"
            },
            {
                "op": "-",
                "r1": "-",
                "r2": "-"
            },
            {
                "op": "-",
                "r1": "-",
                "r2": "-"
            },
            {
                "op": "-",
                "r1": "-",
                "r2": "-"
            },
            {
                "op": "-",
                "r1": "-",
                "r2": "-"
            },
            {
                "op": "-",
                "r1": "-",
                "r2": "-"
            },
            {
                "op": "-",
                "r1": "-",
                "r2": "-"
            },
            {
                "op": "-",
                "r1": "-",
                "r2": "-"
            },
            {
                "op": "-",
                "r1": "-",
                "r2": "-"
            },
            {
                "op": "-",
                "r1": "-",
                "r2": "-"
            },
            {
                "op": "-",
                "r1": "-",
                "r2": "-"
            },
            {
                "op": "-",
                "r1": "-",
                "r2": "-"
            },
            {
                "op": "-",
                "r1": "-",
                "r2": "-"
            }
        ]
    },
    {
        "id": 6,
        "name": "Level 6: Labyrinth of Trees & Rocks",
        "description": "A thick natural forest blocks the way. Gather all 3 collectible types!",
        "hint": "All three collectibles (Diamond, Battery, Magnet) yield 30 total points.",
        "collectibles": [
            {
                "address": 3,
                "type": "diamond",
                "value": 5
            },
            {
                "address": 15,
                "type": "battery",
                "value": 10
            },
            {
                "address": 23,
                "type": "magnet",
                "value": 15
            }
        ],
        "obstacles": [
            {
                "address": 1,
                "type": "tree"
            },
            {
                "address": 8,
                "type": "rock"
            },
            {
                "address": 13,
                "type": "wall"
            },
            {
                "address": 18,
                "type": "bush"
            }
        ],
        "starterProgram": [
            {
                "op": "-",
                "r1": "-",
                "r2": "-"
            },
            {
                "op": "-",
                "r1": "-",
                "r2": "-"
            },
            {
                "op": "-",
                "r1": "-",
                "r2": "-"
            },
            {
                "op": "-",
                "r1": "-",
                "r2": "-"
            },
            {
                "op": "-",
                "r1": "-",
                "r2": "-"
            },
            {
                "op": "-",
                "r1": "-",
                "r2": "-"
            },
            {
                "op": "-",
                "r1": "-",
                "r2": "-"
            },
            {
                "op": "-",
                "r1": "-",
                "r2": "-"
            },
            {
                "op": "-",
                "r1": "-",
                "r2": "-"
            },
            {
                "op": "-",
                "r1": "-",
                "r2": "-"
            },
            {
                "op": "-",
                "r1": "-",
                "r2": "-"
            },
            {
                "op": "-",
                "r1": "-",
                "r2": "-"
            },
            {
                "op": "-",
                "r1": "-",
                "r2": "-"
            },
            {
                "op": "-",
                "r1": "-",
                "r2": "-"
            },
            {
                "op": "-",
                "r1": "-",
                "r2": "-"
            },
            {
                "op": "-",
                "r1": "-",
                "r2": "-"
            }
        ]
    },
    {
        "id": 7,
        "name": "Level 7: ALU Subtraction (SUB)",
        "description": "Practice the SUB instruction. The ALU subtracts Operand 2 from Operand 1 (R1 = R1 - R2).",
        "hint": "SUB R1, R2 performs R1 = R1 - R2. Watch the ALU display the subtraction formula!",
        "collectibles": [
            {
                "address": 10,
                "type": "magnet",
                "value": 15
            },
            {
                "address": 20,
                "type": "diamond",
                "value": 5
            }
        ],
        "obstacles": [
            {
                "address": 5,
                "type": "wall"
            },
            {
                "address": 11,
                "type": "rock"
            },
            {
                "address": 12,
                "type": "cactus"
            },
            {
                "address": 13,
                "type": "bush"
            }
        ],
        "starterProgram": [
            {
                "op": "-",
                "r1": "-",
                "r2": "-"
            },
            {
                "op": "-",
                "r1": "-",
                "r2": "-"
            },
            {
                "op": "-",
                "r1": "-",
                "r2": "-"
            },
            {
                "op": "-",
                "r1": "-",
                "r2": "-"
            },
            {
                "op": "-",
                "r1": "-",
                "r2": "-"
            },
            {
                "op": "-",
                "r1": "-",
                "r2": "-"
            },
            {
                "op": "-",
                "r1": "-",
                "r2": "-"
            },
            {
                "op": "-",
                "r1": "-",
                "r2": "-"
            },
            {
                "op": "-",
                "r1": "-",
                "r2": "-"
            },
            {
                "op": "-",
                "r1": "-",
                "r2": "-"
            },
            {
                "op": "-",
                "r1": "-",
                "r2": "-"
            },
            {
                "op": "-",
                "r1": "-",
                "r2": "-"
            },
            {
                "op": "-",
                "r1": "-",
                "r2": "-"
            },
            {
                "op": "-",
                "r1": "-",
                "r2": "-"
            },
            {
                "op": "-",
                "r1": "-",
                "r2": "-"
            },
            {
                "op": "-",
                "r1": "-",
                "r2": "-"
            }
        ]
    },
    {
        "id": 8,
        "name": "Level 8: Data Memory Store & Recall",
        "description": "Calculate a combined score and use STORE to write it back to Data Memory address [00].",
        "hint": "STORE Rs, [addr] saves the value from register Rs into Data Memory at that address.",
        "collectibles": [
            {
                "address": 2,
                "type": "battery",
                "value": 10
            },
            {
                "address": 16,
                "type": "magnet",
                "value": 15
            }
        ],
        "obstacles": [
            {
                "address": 6,
                "type": "wall"
            },
            {
                "address": 7,
                "type": "wall"
            },
            {
                "address": 8,
                "type": "wall"
            },
            {
                "address": 18,
                "type": "tree"
            }
        ],
        "starterProgram": [
            {
                "op": "-",
                "r1": "-",
                "r2": "-"
            },
            {
                "op": "-",
                "r1": "-",
                "r2": "-"
            },
            {
                "op": "-",
                "r1": "-",
                "r2": "-"
            },
            {
                "op": "-",
                "r1": "-",
                "r2": "-"
            },
            {
                "op": "-",
                "r1": "-",
                "r2": "-"
            },
            {
                "op": "-",
                "r1": "-",
                "r2": "-"
            },
            {
                "op": "-",
                "r1": "-",
                "r2": "-"
            },
            {
                "op": "-",
                "r1": "-",
                "r2": "-"
            },
            {
                "op": "-",
                "r1": "-",
                "r2": "-"
            },
            {
                "op": "-",
                "r1": "-",
                "r2": "-"
            },
            {
                "op": "-",
                "r1": "-",
                "r2": "-"
            },
            {
                "op": "-",
                "r1": "-",
                "r2": "-"
            },
            {
                "op": "-",
                "r1": "-",
                "r2": "-"
            },
            {
                "op": "-",
                "r1": "-",
                "r2": "-"
            },
            {
                "op": "-",
                "r1": "-",
                "r2": "-"
            },
            {
                "op": "-",
                "r1": "-",
                "r2": "-"
            }
        ]
    },
    {
        "id": 9,
        "name": "Level 9: Instruction Optimization",
        "description": "Collectibles are scattered across the maze. Collect them with an efficient path!",
        "hint": "Can you gather all items and finish in minimal instructions?",
        "collectibles": [
            {
                "address": 4,
                "type": "diamond",
                "value": 5
            },
            {
                "address": 10,
                "type": "battery",
                "value": 10
            },
            {
                "address": 14,
                "type": "magnet",
                "value": 15
            }
        ],
        "obstacles": [
            {
                "address": 8,
                "type": "wall"
            },
            {
                "address": 16,
                "type": "rock"
            },
            {
                "address": 18,
                "type": "bush"
            }
        ],
        "starterProgram": [
            {
                "op": "-",
                "r1": "-",
                "r2": "-"
            },
            {
                "op": "-",
                "r1": "-",
                "r2": "-"
            },
            {
                "op": "-",
                "r1": "-",
                "r2": "-"
            },
            {
                "op": "-",
                "r1": "-",
                "r2": "-"
            },
            {
                "op": "-",
                "r1": "-",
                "r2": "-"
            },
            {
                "op": "-",
                "r1": "-",
                "r2": "-"
            },
            {
                "op": "-",
                "r1": "-",
                "r2": "-"
            },
            {
                "op": "-",
                "r1": "-",
                "r2": "-"
            },
            {
                "op": "-",
                "r1": "-",
                "r2": "-"
            },
            {
                "op": "-",
                "r1": "-",
                "r2": "-"
            },
            {
                "op": "-",
                "r1": "-",
                "r2": "-"
            },
            {
                "op": "-",
                "r1": "-",
                "r2": "-"
            },
            {
                "op": "-",
                "r1": "-",
                "r2": "-"
            },
            {
                "op": "-",
                "r1": "-",
                "r2": "-"
            },
            {
                "op": "-",
                "r1": "-",
                "r2": "-"
            },
            {
                "op": "-",
                "r1": "-",
                "r2": "-"
            }
        ]
    },
    {
        "id": 10,
        "name": "Level 10: Grand Master CPU Architect",
        "description": "The ultimate final challenge: Full CPU integration with multiple collectibles, ALU computation, and obstacles!",
        "hint": "Execute the complete Fetch-Decode-Execute-WriteBack pipeline to triumph!",
        "collectibles": [
            {
                "address": 1,
                "type": "diamond",
                "value": 5
            },
            {
                "address": 7,
                "type": "battery",
                "value": 10
            },
            {
                "address": 17,
                "type": "magnet",
                "value": 15
            },
            {
                "address": 23,
                "type": "battery",
                "value": 10
            }
        ],
        "obstacles": [
            {
                "address": 3,
                "type": "wall"
            },
            {
                "address": 8,
                "type": "wall"
            },
            {
                "address": 11,
                "type": "rock"
            },
            {
                "address": 15,
                "type": "cactus"
            },
            {
                "address": 19,
                "type": "tree"
            }
        ],
        "starterProgram": [
            {
                "op": "-",
                "r1": "-",
                "r2": "-"
            },
            {
                "op": "-",
                "r1": "-",
                "r2": "-"
            },
            {
                "op": "-",
                "r1": "-",
                "r2": "-"
            },
            {
                "op": "-",
                "r1": "-",
                "r2": "-"
            },
            {
                "op": "-",
                "r1": "-",
                "r2": "-"
            },
            {
                "op": "-",
                "r1": "-",
                "r2": "-"
            },
            {
                "op": "-",
                "r1": "-",
                "r2": "-"
            },
            {
                "op": "-",
                "r1": "-",
                "r2": "-"
            },
            {
                "op": "-",
                "r1": "-",
                "r2": "-"
            },
            {
                "op": "-",
                "r1": "-",
                "r2": "-"
            },
            {
                "op": "-",
                "r1": "-",
                "r2": "-"
            },
            {
                "op": "-",
                "r1": "-",
                "r2": "-"
            },
            {
                "op": "-",
                "r1": "-",
                "r2": "-"
            },
            {
                "op": "-",
                "r1": "-",
                "r2": "-"
            },
            {
                "op": "-",
                "r1": "-",
                "r2": "-"
            },
            {
                "op": "-",
                "r1": "-",
                "r2": "-"
            },
            {
                "op": "-",
                "r1": "-",
                "r2": "-"
            },
            {
                "op": "-",
                "r1": "-",
                "r2": "-"
            }
        ]
    }
];

window.LEVELS_DATA = LEVELS_DATA;
