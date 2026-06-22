import type {Cell, Player} from "../board/boardConfig.ts";

export type GameState = {
    players: Player[],
    currentPlayerIndex: number,
    lastRoll: number | null,
    lastMessage: string
    history: string[],
    waitingForAnswer: boolean,
    gameOver: boolean
}

export type GameAction =
    | { type: 'ROLL_DICE'; cells: Cell[], roll?: number }
    | { type: 'ANSWER_QUESTION'; correct: boolean }

export function createInitialState(players: Player[]): GameState {
    const firstMessage = `${players[0].name} кидає кубік`
    return {
        players,
        currentPlayerIndex: 0,
        lastRoll: null,
        lastMessage: firstMessage,
        history: [firstMessage],
        waitingForAnswer: false,
        gameOver: false,
    }
}

function getFinishedCount(players: Player[]): number {
    return players.filter(p => p.finishPlace !== null).length
}

export function gameReducer(state: GameState, action: GameAction): GameState {
    switch (action.type) {

        case 'ROLL_DICE': {
            if (state.waitingForAnswer || state.gameOver) return state

            const roll = action.roll ?? Math.floor(Math.random() * 6) + 1
            const currentPlayer = state.players[state.currentPlayerIndex]
            const nextPlayerIndex = (state.currentPlayerIndex + 1) % state.players.length
            const nextPlayer = state.players[nextPlayerIndex]

            if (currentPlayer.finishPlace) {
                return { ...state, currentPlayerIndex: nextPlayerIndex, }
            }

            if (currentPlayer.skipNextTurn && !currentPlayer.hasKey) {
                const updatedPlayers = state.players.map(p =>
                    p.id === currentPlayer.id
                        ? { ...p, skipNextTurn: false }
                        : p
                )
                const lastMessage = `${currentPlayer.name} пропускає хід. Хід: ${nextPlayer.name}`

                return {
                    ...state,
                    players: updatedPlayers,
                    currentPlayerIndex: nextPlayerIndex,
                    lastMessage: lastMessage,
                    history: [...state.history, lastMessage]
                }
            }

            const usedKey = currentPlayer.skipNextTurn && currentPlayer.hasKey

            const newPosition = Math.min(
                currentPlayer.position + roll,
                action.cells.length - 1
            )
            const cell = action.cells[newPosition]

            const finalPosition = cell.type === 'teleport' && cell.teleportTo !== undefined
                ? cell.teleportTo
                : newPosition

            const finalCell = action.cells[finalPosition]

            const teleportMsg = cell.type === 'teleport'
                ? `🌀 телепорт → клітинка ${finalPosition}!`
                : null

            const isFinished = finalCell.type === 'finish' && currentPlayer.finishPlace === null
            const finishedCount = getFinishedCount(state.players)
            const finishPlace = isFinished ? finishedCount + 1 : currentPlayer.finishPlace

            const placeScore = finishPlace === 1 ? 5 : finishPlace === 2 ? 3 : 0
            const keyScore = isFinished ? currentPlayer.keys * 1 : 0  // ключі що залишились

            const updatedPlayers = state.players.map(p =>
                p.id === currentPlayer.id
                    ? {
                        ...p,
                        position: finalPosition,
                        skipNextTurn: finalCell.type === 'jail',
                        hasKey: finalCell.type === 'key' ? true : usedKey ? false : p.hasKey,
                        keys: finalCell.type === 'key'
                            ? p.keys + 1
                            : usedKey ? p.keys - 1 : p.keys,
                        finishPlace,
                        score: isFinished
                            ? p.score + placeScore + keyScore
                            : p.score,
                    }
                    : p
            )

            // const updatedNextPlayer = updatedPlayers[nextPlayerIndex]

            const allFinished = updatedPlayers.every(p => p.finishPlace !== null)

            const msg = [
                usedKey && `${currentPlayer.name} використав ключ!`,
                finalCell.type === 'key' && `${currentPlayer.name} знайшов ключ! (+1 бал якщо залишиться)`,
                finalCell.type === 'jail' && `${currentPlayer.name} потрапив у в'язницю!`,
                isFinished && `🏁 ${currentPlayer.name} фінішував на ${finishPlace} місці! +${placeScore + keyScore} балів`,
                !isFinished && `${currentPlayer.name} кинув ${roll} → клітинка ${newPosition}`,
                teleportMsg
            ].filter(Boolean).join(' ')

            if (finalCell.type === 'question') {
                const message = `${currentPlayer.name} кинув ${roll} → питання! Відповідайте...`;
                return {
                    ...state,
                    players: updatedPlayers,
                    lastRoll: roll,
                    waitingForAnswer: true,
                    gameOver: allFinished,
                    lastMessage: message,
                    history: [...state.history, message]
                }
            }


            return {
                ...state,
                players: updatedPlayers,
                lastRoll: roll,
                currentPlayerIndex: nextPlayerIndex,
                gameOver: allFinished,
                lastMessage: msg,
                history: [...state.history, msg]
            }
        }

        case 'ANSWER_QUESTION': {
            const currentPlayer = state.players[state.currentPlayerIndex]
            const nextPlayerIndex = (state.currentPlayerIndex + 1) % state.players.length

            const updatedPlayers = state.players.map(p =>
                p.id === currentPlayer.id
                    ? { ...p, score: action.correct ? p.score + 2 : p.score }
                    : p
            )

            const msg = action.correct
                ? `${currentPlayer.name} відповів правильно! +2 бали. Хід: ${state.players[nextPlayerIndex].name}`
                : `${currentPlayer.name} відповів неправильно. Хід: ${state.players[nextPlayerIndex].name}`
            return {
                ...state,
                players: updatedPlayers,
                currentPlayerIndex: nextPlayerIndex,
                waitingForAnswer: false,
                lastMessage: msg,
                history: [...state.history, msg]
            }
        }
        default:
            return state
    }
}