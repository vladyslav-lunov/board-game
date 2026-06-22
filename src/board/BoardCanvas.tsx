import {type ReactElement, useEffect, useRef} from "react";
import {type Cell, type Player} from "./boardConfig.ts";


const CELL_COLORS: Record<string, string> = {
    normal: '#c8a96e',
    question: '#f5c518',
    key: '#4caf50',
    jail: '#888888',
    teleport: '#e91e63',
    start:    '#27ae60',  // ← додайте
    finish:   '#8e44ad',
}

const CELL_EMOJI: Record<string, string> = {
    normal:   '',
    question: '❓',
    key:      '🔑',
    jail:     '🔒',
    teleport: '🌀',
    start:    '🚀',
    finish:   '🏁',
}

function drawCell(ctx: CanvasRenderingContext2D, cell: Cell) {
    ctx.beginPath()
    ctx.arc(cell.x, cell.y, 24, 0, Math.PI * 2)
    ctx.fillStyle = CELL_COLORS[cell.type]
    ctx.fill()
    ctx.strokeStyle = '#5a3e1b'
    ctx.lineWidth = 2
    ctx.stroke()

    ctx.fillStyle = '#000'
    ctx.font = '10px Arial'
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillText(String(cell.id), cell.x, cell.y - 7)

    const emoji = CELL_EMOJI[cell.type]
    if (emoji) {
        ctx.font = '14px Arial'
        ctx.fillText(emoji, cell.x, cell.y + 8)
    }
}

function drawPlayer(ctx: CanvasRenderingContext2D, cell: Cell, player: Player, offset: number) {
    ctx.beginPath()
    ctx.arc(cell.x + offset, cell.y - 5, 10, 0, Math.PI * 2)
    ctx.fillStyle = player.color
    ctx.fill()
    ctx.strokeStyle = '#fff'
    ctx.lineWidth = 2
    ctx.stroke()
}

type Props = {
    cells: Cell[],
    players: Player[]
}

export const BoardCanvas = ({cells, players}: Props): ReactElement => {
    const canvas = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        if (!canvas.current) return;
        const ctx = canvas.current.getContext('2d');
        if (!ctx) return;

        ctx.clearRect(0, 0, 800, 600)
        cells.forEach(cell => drawCell(ctx, cell))

        players.forEach((player, index) => {
            const cell = cells[player.position]
            if (!cell) return
            drawPlayer(ctx, cell, player, index * 20) // кожен зміщений на 20px
        })

    }, [cells, players]);

    return (
        <canvas ref={canvas} width={800} height={600} style={{border: "1px solid black"}}></canvas>
    )
}