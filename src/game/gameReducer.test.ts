import { describe, it, expect } from 'vitest'
import {createInitialState, gameReducer} from "./gameReducer.ts";
import {type Cell, CELLS, INIT_PLAYERS} from "../board/boardConfig.ts";

describe('gameReducer', () => {

    it('player move after dice rolling', () => {
        const state = createInitialState(INIT_PLAYERS)
        const newState = gameReducer(state, {type: 'ROLL_DICE', cells: CELLS})
        expect(newState.players[0].position).toBeGreaterThan(0)
    })

    it('next turn for the next player', () => {
        const state = createInitialState(INIT_PLAYERS)
        const newState = gameReducer(state, {type: 'ROLL_DICE', cells: CELLS})
        expect(newState.currentPlayerIndex).toBe(1)
    })

    it('player skips turn if they are in jail', () => {
        const state = createInitialState([
            { id: 0, name: 'Player 1', position: 6, color: '#e74c3c', skipNextTurn: true, hasKey: false, keys: 0, score: 0, finishPlace: null },
            { id: 1, name: 'Player 2', position: 0, color: '#3498db', skipNextTurn: false, hasKey: false, keys: 0, score: 0, finishPlace: null },
        ])
        const newState = gameReducer(state, { type: 'ROLL_DICE', cells: CELLS })

        expect(newState.players[0].position).toBe(6)
        expect(newState.players[0].skipNextTurn).toBe(false)
        expect(newState.currentPlayerIndex).toBe(1)
    })

    it('player leave jail with using key', () => {
        const state = createInitialState([
            { id: 0, name: 'Player 1', position: 6, color: '#e74c3c', skipNextTurn: true, hasKey: true , score: 0, keys: 0, finishPlace: null},
            { id: 1, name: 'Player 2', position: 0, color: '#3498db', skipNextTurn: false, hasKey: false, score: 0, keys: 0, finishPlace: null },
        ])

        const newState = gameReducer(state, { type: 'ROLL_DICE', cells: CELLS })
        expect(newState.players[0].position).toBeGreaterThan(6)
        expect(newState.players[0].hasKey).toBe(false)
        expect(newState.players[0].skipNextTurn).toBe(false)
    })
})

const mockCells: Cell[] = [
    { id: 0, x: 0, y: 0, type: 'start' },
    { id: 1, x: 0, y: 0, type: 'normal' },
    { id: 2, x: 0, y: 0, type: 'normal' },
    { id: 3, x: 0, y: 0, type: 'teleport', teleportTo: 7 },
    { id: 4, x: 0, y: 0, type: 'normal' },
    { id: 5, x: 0, y: 0, type: 'normal' },
    { id: 6, x: 0, y: 0, type: 'normal' },
    { id: 7, x: 0, y: 0, type: 'normal' },
    { id: 8, x: 0, y: 0, type: 'jail' },
    { id: 9, x: 0, y: 0, type: 'finish' },
]

const mockPlayers = [
    { id: 0, name: 'P1', position: 0, color: 'red', skipNextTurn: false, hasKey: false, keys: 0, score: 0, finishPlace: null },
    { id: 1, name: 'P2', position: 0, color: 'blue', skipNextTurn: false, hasKey: false, keys: 0, score: 0, finishPlace: null },
]

describe('teleport', () => {
    it('гравець телепортується з клітинки 3 на клітинку 7', () => {
        const state = createInitialState(mockPlayers)

        const newState = gameReducer(state, {
            type: 'ROLL_DICE',
            cells: mockCells,
            roll: 3  // фіксований кидок → клітинка 3 → teleport → 7
        })

        expect(newState.players[0].position).toBe(7)
        expect(newState.lastMessage).toContain('🌀')
    })

    it('телепорт назад — гравець переміщується на меншу клітинку', () => {
        const stateWithPlayerAhead = createInitialState([
            { ...mockPlayers[0], position: 6 },  // гравець вже на 6
            mockPlayers[1],
        ])

        // додамо teleport назад на клітинці 7
        const cellsWithBackTeleport: Cell[] = mockCells.map(c =>
            c.id === 7 ? { ...c, type: 'teleport', teleportTo: 2 } : c
        )

        const newState = gameReducer(stateWithPlayerAhead, {
            type: 'ROLL_DICE',
            cells: cellsWithBackTeleport,
            roll: 1  // 6 + 1 = 7 → teleport → 2
        })

        expect(newState.players[0].position).toBe(2)
    })

})