export type CellType = 'normal' | 'teleport' | 'question' | 'key' | 'jail';

export type Cell = {
    id: number,
    x: number,
    y: number,
    type: CellType
}

export const CELLS: Cell[] = [
    { id: 0,  x: 100, y: 500, type: 'normal' },
    { id: 1,  x: 160, y: 500, type: 'normal' },
    { id: 2,  x: 220, y: 500, type: 'question' },
    { id: 3,  x: 280, y: 500, type: 'normal' },
    { id: 4,  x: 340, y: 500, type: 'key' },
    { id: 5,  x: 340, y: 440, type: 'normal' },
    { id: 6,  x: 340, y: 380, type: 'jail' },
    { id: 7,  x: 280, y: 380, type: 'normal' },
    { id: 8,  x: 220, y: 380, type: 'question' },
    { id: 9,  x: 160, y: 380, type: 'normal' },
    { id: 10, x: 100, y: 380, type: 'normal' },
]

export type Player = {
    id: number,
    name: string,
    position:number,
    color: string,
    skipNextTurn: boolean,
    hasKey: boolean
}

export const INIT_PLAYERS : Player[] = [
    {id: 0, name: "Player 1", position: 0, color:  '#e74c3c', skipNextTurn: false, hasKey: false},
    { id: 1, name: 'Player 2', position: 0, color: '#3498db', skipNextTurn: false, hasKey: false },
]