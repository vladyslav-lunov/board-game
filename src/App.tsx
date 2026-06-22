import './App.css'
import {BoardCanvas} from "./board/BoardCanvas.tsx";
import {CELLS, INIT_PLAYERS} from "./board/boardConfig.ts";
import {useReducer} from "react";
import {createInitialState, gameReducer} from "./game/gameReducer.ts";

function App() {
    const [gameState, dispatch] = useReducer(
        gameReducer,
        createInitialState(INIT_PLAYERS)
    )

    return (
        <>
            {gameState.gameOver ? (
                    <div>
                        <h2>🎄 Гра завершена!</h2>
                        {[...gameState.players]
                            .sort((a, b) => b.score - a.score)
                            .map(p => (
                                <p key={p.id}>
                                    {p.finishPlace} місце — {p.name}: {p.score} балів
                                </p>
                            ))}
                    </div>
                ) :
                <div>
                    <div style={{display: "flex", justifyContent: "space-between", alignItems: "center"}}>
                        {gameState.waitingForAnswer ? (
                            <div>
                                <p>❓ 2 + 2 = ?</p>
                                <button onClick={() => dispatch({type: 'ANSWER_QUESTION', correct: true})}>
                                    ✅ Правильно
                                </button>
                                <button onClick={() => dispatch({type: 'ANSWER_QUESTION', correct: false})}>
                                    ❌ Неправильно
                                </button>
                            </div>
                        ) : (
                            <button onClick={() => dispatch({type: 'ROLL_DICE', cells: CELLS})}>
                                🎲 Кинути кубик
                            </button>
                        )}
                        <div style={{display: "flex", flexDirection: "column", width: "500px"}}>
                            <h2>Players:</h2>
                            <p>{gameState.lastMessage}</p>
                        </div>
                    </div>

                    <div style={{display: "flex", justifyContent: "space-between"}}>
                        <BoardCanvas cells={CELLS} players={gameState.players}/>
                        {gameState.players.map(p => (
                            <span key={p.id} style={{color: p.color, marginRight: 16}}>
              {p.name}: {p.score} балів | ключів: {p.keys}
                                {p.skipNextTurn ? ' 🔒' : ''}
                                {p.hasKey ? ' 🗝️' : ''}
            </span>
                        ))}

                    </div>
                    <ul>
                        {
                            gameState.history.map((elem, index) => <li key={elem}>
                                {index + 1} : {elem}
                            </li>)}
                    </ul>
                </div>
            }
        </>
    )
}

export default App
