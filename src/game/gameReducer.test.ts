import { describe, it, expect } from 'vitest'
import {createInitialState, gameReducer} from "./gameReducer.ts";
import {CELLS, INIT_PLAYERS} from "../board/boardConfig.ts";

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
            { id: 0, name: 'Player 1', position: 6, color: '#e74c3c', skipNextTurn: true, hasKey: false },
            { id: 1, name: 'Player 2', position: 0, color: '#3498db', skipNextTurn: false, hasKey: false },
        ])
        const newState = gameReducer(state, { type: 'ROLL_DICE', cells: CELLS })

        expect(newState.players[0].position).toBe(6)
        expect(newState.players[0].skipNextTurn).toBe(false)
        expect(newState.currentPlayerIndex).toBe(1)
    })

    it('player leave jail with using key', () => {
        const state = createInitialState([
            { id: 0, name: 'Player 1', position: 6, color: '#e74c3c', skipNextTurn: true, hasKey: true },
            { id: 1, name: 'Player 2', position: 0, color: '#3498db', skipNextTurn: false, hasKey: false },
        ])

        const newState = gameReducer(state, { type: 'ROLL_DICE', cells: CELLS })
        expect(newState.players[0].position).toBeGreaterThan(6)
        expect(newState.players[0].hasKey).toBe(false)
        expect(newState.players[0].skipNextTurn).toBe(false)
    })
})