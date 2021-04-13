import React, { useState } from "react";
import Cell from "./Cell";
import "./Board.css";

/** Game board of Lights out.
 *
 * Properties:
 *
 * - nrows: number of rows of board
 * - ncols: number of cols of board
 * - chanceLightStartsOn: float, chance any cell is lit at start of game
 *
 * State:
 *
 * - board: array-of-arrays of true/false
 *
 *    For this board:
 *       .  .  .
 *       O  O  .     (where . is off, and O is on)
 *       .  .  .
 *
 *    This would be: [[f, f, f], [t, t, f], [f, f, f]]
 *
 *  This should render an HTML table of individual <Cell /> components.
 *
 *  This doesn't handle any clicks --- clicks are on individual cells
 *
 **/

function Board({ nrows, ncols, chanceLightStartsOn }) {
  const [board, setBoard] = useState(createBoard());

  /** create a board nrows high/ncols wide, each cell randomly lit or unlit */
  function createBoard() {
    let initialBoard = Array.from({ length: nrows }, (v, i) => {
      return Array.from(
        { length: ncols },
        (v, i) => Math.random() < chanceLightStartsOn
      );
    });
    return initialBoard;
  }

  function hasWon() {
    return board.every((r) => r.every((c) => !c));
  }

  function newGame() {
    setBoard(() => createBoard());
  }

  function flipCellsAround(coord) {
    setBoard((oldBoard) => {
      const [y, x] = coord.split("-").map(Number);

      const flipCell = (y, x, boardCopy) => {
        // if this coord is actually on board, flip it

        if (x >= 0 && x < ncols && y >= 0 && y < nrows) {
          boardCopy[y][x] = !boardCopy[y][x];
        }
      };

      const boardCopy = [...oldBoard];

      flipCell(y, x, boardCopy);
      flipCell(y - 1, x, boardCopy);
      flipCell(y + 1, x, boardCopy);
      flipCell(y, x - 1, boardCopy);
      flipCell(y, x + 1, boardCopy);

      return boardCopy;
    });
  }

  // if the game is won, just show a winning msg & render nothing else
  if (hasWon()) {
    return (
      <div>
        <h1>You win!</h1>
        <button onClick={newGame}>Play again</button>
      </div>
    );
  }

  // make table board
  const tableBoard = (
    <table className="Board">
      <tbody>
        {board.map((r, idxR) => {
          return (
            <tr key={idxR}>
              {r.map((c, idxC) => (
                <Cell
                  flipCellsAroundMe={flipCellsAround}
                  isLit={c}
                  id={`${idxR}-${idxC}`}
                  key={`${idxR}-${idxC}`}
                />
              ))}
            </tr>
          );
        })}
      </tbody>
    </table>
  );

  return tableBoard;
}

Board.defaultProps = {
  nrows: 3,
  ncols: 3,
  chanceLightStartsOn: 0.5,
};

export default Board;
