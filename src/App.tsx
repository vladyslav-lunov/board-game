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
            <h1>Christmas Board Game</h1>

            <div>
                <h2>Players:</h2>
                <p>{gameState.message}</p>
                <button onClick={() => dispatch({type: 'ROLL_DICE', cells: CELLS})}>
                    🎲 Кинути кубик
                </button>
                <BoardCanvas cells={CELLS} players={gameState.players}/>
            </div>
            <pre>{JSON.stringify(gameState.players, null, 2)}</pre>

        </>
    )
}

export default App
