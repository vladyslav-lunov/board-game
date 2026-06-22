export type CellType = 'normal' | 'teleport' | 'question' | 'key' | 'jail' | 'start' | 'finish';

export type Cell = {
    id: number,
    x: number,
    y: number,
    type: CellType,
    teleportTo?: number
}

export const CELLS: Cell[] = [
    // рядок 1 — зліва направо (y: 500)
    { id: 0,  x: 100, y: 500, type: 'start' },
    { id: 1,  x: 160, y: 500, type: 'normal' },
    { id: 2,  x: 220, y: 500, type: 'question' },
    { id: 3,  x: 280, y: 500, type: 'teleport', teleportTo: 10 },
    { id: 4,  x: 340, y: 500, type: 'key' },
    { id: 5,  x: 400, y: 500, type: 'normal' },
    { id: 6,  x: 460, y: 500, type: 'jail' },
    { id: 7,  x: 520, y: 500, type: 'normal' },
    { id: 8,  x: 580, y: 500, type: 'question' },
    { id: 9,  x: 640, y: 500, type: 'normal' },

    // поворот вгору (x: 640)
    { id: 10, x: 640, y: 440, type: 'normal' },

    // рядок 2 — справа наліво (y: 380)
    { id: 11, x: 640, y: 380, type: 'normal' },
    { id: 12, x: 580, y: 380, type: 'normal' },
    { id: 13, x: 520, y: 380, type: 'question' },
    { id: 14, x: 460, y: 380, type: 'normal' },
    { id: 15, x: 400, y: 380, type: 'key' },
    { id: 16, x: 340, y: 380, type: 'normal' },
    { id: 17, x: 280, y: 380, type: 'jail' },
    { id: 18, x: 220, y: 380, type: 'normal' },
    { id: 19, x: 160, y: 380, type: 'question' },
    { id: 20, x: 100, y: 380, type: 'normal' },

    // поворот вгору (x: 100)
    { id: 21, x: 100, y: 320, type: 'normal' },

    // рядок 3 — зліва направо (y: 260)
    { id: 22, x: 100, y: 260, type: 'normal' },
    { id: 23, x: 160, y: 260, type: 'question' },
    { id: 24, x: 220, y: 260, type: 'teleport', teleportTo: 14 },
    { id: 25, x: 280, y: 260, type: 'key' },
    { id: 26, x: 340, y: 260, type: 'normal' },
    { id: 27, x: 400, y: 260, type: 'jail' },
    { id: 28, x: 460, y: 260, type: 'normal' },
    { id: 29, x: 520, y: 260, type: 'question' },
    { id: 30, x: 580, y: 260, type: 'normal' },
    { id: 31, x: 640, y: 260, type: 'finish' },
]

export type Player = {
    id: number,
    name: string,
    position:number,
    color: string,
    score: number,
    keys: number,
    skipNextTurn: boolean,
    hasKey: boolean,
    finishPlace: number | null
}

export const INIT_PLAYERS : Player[] = [
    {id: 0, name: "Player 1", position: 0, color:  '#e74c3c', skipNextTurn: false, hasKey: false, keys: 0, score: 0, finishPlace: null},
    { id: 1, name: 'Player 2', position: 0, color: '#3498db', skipNextTurn: false, hasKey: false, keys: 0, score: 0, finishPlace: null },
]