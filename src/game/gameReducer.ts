import type {Cell, Player} from "../board/boardConfig.ts";

export type GameState = {
    players: Player[],
    currentPlayerIndex: number,
    lastRoll: number | null,
    message: string
}

export type GameAction =
    | { type: 'ROLL_DICE'; cells: Cell[] }

export function createInitialState(players: Player[]): GameState {
    return {
        players,
        currentPlayerIndex: 0,
        lastRoll: null,
        message: 'Гравець 1 кидає кубик',
    }
}

export function gameReducer(state: GameState, action: GameAction): GameState {
    switch (action.type) {

        case 'ROLL_DICE': {
            const roll = Math.floor(Math.random() * 6) + 1
            const currentPlayer = state.players[state.currentPlayerIndex]
            const nextPlayerIndex = (state.currentPlayerIndex + 1) % state.players.length
            const nextPlayer = state.players[nextPlayerIndex]

            // гравець у в'язниці БЕЗ ключа — пропускає хід
            if (currentPlayer.skipNextTurn && !currentPlayer.hasKey) {
                const updatedPlayers = state.players.map(p =>
                    p.id === currentPlayer.id
                        ? { ...p, skipNextTurn: false }
                        : p
                )
                return {
                    ...state,
                    players: updatedPlayers,
                    currentPlayerIndex: nextPlayerIndex,
                    message: `${currentPlayer.name} пропускає хід. Хід: ${nextPlayer.name}`,
                }
            }

            // якщо дійшли сюди — або гравець вільний, або має ключ
            const usedKey = currentPlayer.skipNextTurn && currentPlayer.hasKey

            const newPosition = Math.min(
                currentPlayer.position + roll,
                action.cells.length - 1
            )
            const cell = action.cells[newPosition]

            // все в одному map — один новий об'єкт гравця
            const updatedPlayers = state.players.map(p =>
                p.id === currentPlayer.id
                    ? {
                        ...p,
                        position: newPosition,
                        skipNextTurn: cell.type === 'jail',
                        hasKey: usedKey ? false : cell.type === 'key' ? true : p.hasKey,
                    }
                    : p
            )

            const updatedNextPlayer = updatedPlayers[nextPlayerIndex]

            const msg = [
                usedKey && `${currentPlayer.name} використав ключ!`,
                cell.type === 'key' && `${currentPlayer.name} знайшов ключ!`,
                cell.type === 'question' && `Питання: 2 + 2 = ?`,
                cell.type === 'jail' && `${currentPlayer.name} потрапив у в'язницю!`,
                `${currentPlayer.name} кинув ${roll} → клітинка ${newPosition}. Хід: ${updatedNextPlayer.name}`,
            ].filter(Boolean).join(' ')

            return {
                ...state,
                players: updatedPlayers,
                lastRoll: roll,
                currentPlayerIndex: nextPlayerIndex,
                message: msg,
            }
        }
        default:
            return state
    }
}