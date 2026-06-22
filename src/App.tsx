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

            <div>
                <div style={{display: "flex",   justifyContent: "space-between", alignItems: "center"}}>
                    <button
                        onClick={() => dispatch({type: 'ROLL_DICE', cells: CELLS})}
                        style={
                            {
                                width: '60px'
                            }
                        }
                    >
                        🎲 Кинути кубик
                    </button>
                    <div style={{display: "flex", flexDirection: "column", width: "500px"}}>
                        <h2>Players:</h2>
                        <p>{gameState.message}</p>
                    </div>
                </div>

                <div style={{display: "flex", justifyContent: "space-between"}}>
                    <BoardCanvas cells={CELLS} players={gameState.players}/>
                    <pre>{JSON.stringify(gameState.players, null, 2)}</pre>
                </div>
            </div>

        </>
    )
}

export default App
