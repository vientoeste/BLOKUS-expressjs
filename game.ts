export const block = {
  five: {
    a: [[1, 1, 1, 1, 1]],
    b: [
      [1, 1, 1],
      [1, 0, 0],
      [1, 0, 0],
    ],
    c: [
      [0, 1, 0],
      [1, 1, 1],
      [0, 1, 0],
    ],
    d: [
      [0, 0, 1],
      [0, 1, 1],
      [1, 1, 0],
    ],
    e: [
      [1, 0, 0],
      [1, 1, 1],
      [0, 1, 0],
    ],
    f: [
      [1, 1, 1],
      [0, 1, 0],
      [0, 1, 0],
    ],
    g: [
      [1, 1, 1, 1],
      [1, 0, 0, 0],
    ],
    h: [
      [0, 0, 1],
      [1, 1, 1],
      [1, 0, 0],
    ],
  },
  four: {
    a: [[1, 1, 1, 1]],
    b: [[1, 1, 1], [1, 0, 0]],
    c: [[1, 1, 1], [0, 1, 0]],
    d: [[1, 1, 0], [0, 1, 1]],
    e: [[1, 1], [1, 1]],
  },
  three: {
    a: [[1, 1, 1]],
    b: [[1, 1], [1, 0]],
  },
  two: {
    a: [[1, 1]],
  },
  one: {
    a: [[1]],
  },
};

export const createNewBoard = Array.from(Array(20), () => {
  const newArr: number[] = [];
  newArr.length = 20;
  return newArr.fill(0);
});

const rotateBlock = (newBlock: number[][], rotation: number) => {
  // matrix rotate ALG
};

export const putBlockOnBoard = (
  board: number[][],
  newBlock: number[][],
  position: number[],
  rotation: number,
): number[][] => {
  if (position.length !== 2) {
    throw new Error('position length must be 2');
  }
  if (/0-3/.test(rotation.toString())) {
    throw new Error('rotation must be included in 0-3');
  }
  const rotatedBlock = rotateBlock(newBlock, rotation);
  // put block on board and return board
  return board;
};
