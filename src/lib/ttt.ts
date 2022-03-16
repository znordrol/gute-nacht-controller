export type XO = 'X' | 'O' | undefined;

export type Board = [[XO, XO, XO], [XO, XO, XO], [XO, XO, XO]];

export type TTT = {
  board: Board;
  lastPlay: XO;
  winner: XO;
  draw?: boolean;
};

export const isBoardFull = (x: Board) => x.every((y) => y.every((z) => z));

export const getWinner = (x: Board) => {
  const winners = new Set<XO>();

  for (let i = 0; i < 3; ++i) {
    if (x[0][i] && new Set([x[0][i], x[1][i], x[2][i]]).size === 1) {
      winners.add(x[0][i]);
    }
  }

  for (let i = 0; i < 3; ++i) {
    if (x[i][0] && new Set(x[i]).size === 1) {
      winners.add(x[i][0]);
    }
  }

  if (
    x[1][1] &&
    (new Set([x[0][0], x[1][1], x[2][2]]).size === 1 ||
      new Set([x[0][2], x[1][1], x[2][0]]).size === 1)
  ) {
    winners.add(x[1][1]);
  }

  if (!winners.size) {
    // completion check

    return isBoardFull(x) ? 'DRAW' : 'INCOMPLETE';
  }

  return winners.values().next().value as Exclude<XO, undefined>;
};

export const insertPlay = (x: TTT, c: [number, number]) => {
  if (!x.board[c[0]][c[1]]) return x;

  x.lastPlay = x.lastPlay === 'X' ? 'O' : 'X';
  x.board[c[0]][c[1]] = x.lastPlay;
  return x;
};
