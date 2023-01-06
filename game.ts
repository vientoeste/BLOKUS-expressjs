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

const rotateBlockToClockwiseDir = (newBlock: number[][]): number[][] => {
  const blockToReturn: number[][] = [];

  const x = newBlock[0].length;
  const y = newBlock.length;
  blockToReturn.length = x;
  for (let i = 0; i < newBlock[0].length; i += 1) {
    blockToReturn[i] = [];
  }
  blockToReturn[0].length = y;

  for (let i = 0; i < y; i += 1) {
    for (let j = 0; j < x; j += 1) {
      blockToReturn[j][y - i - 1] = newBlock[i][j];
    }
  }

  return blockToReturn;
};

const rotateBlock = (newBlock: number[][], rotation: number) => {
  let rotatedBlock: number[][] = [];
  for (let i = 0; i < rotation; i += 1) {
    rotatedBlock = rotateBlockToClockwiseDir(newBlock);
  }
  return rotatedBlock;
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