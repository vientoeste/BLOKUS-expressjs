/**
 * 디버깅용 함수. 콘솔 출력 시 블록에 색 입히기 시도(안 되면 삭제 예정)
 */
const printBlock = (board: (string | number)[][]) => {

};

export const BLOCK = {
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

export const createNewBoard = (): (string | number)[][] => Array.from(Array(20), () => {
  const newArr: (string | number)[] = [];
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
  let rotatedBlock: number[][] = newBlock;
  for (let i = 0; i < rotation; i += 1) {
    rotatedBlock = rotateBlockToClockwiseDir(rotatedBlock);
  }
  return rotatedBlock;
};

const isAvailableArea = (board: (string | number)[][], block: number[][], position: number[]) => {
  if (position[1] + block[0].length > 20 || position[0] + block.length > 20) {
    throw new Error('range out');
  }
  const x = block[0].length;
  const y = block.length;
  const affectedArea: (number | string)[][] = [];
  const regExpY = new RegExp(`0|${20 - y}`);
  const regExpX = new RegExp(`0|${20 - x}`);
  if (regExpY.test(position[0].toString()) && regExpX.test(position[1].toString())) {
    return true;
  }
  for (let i = position[0] - 1; i <= position[0] + y; i += 1) {
    for (let j = position[1] - 1; j <= position[1] + x; j += 1) {
      if (i - position[0] < -1) {
        continue;
      }
      if (!affectedArea[i - position[0] + 1]) {
        affectedArea[i - position[0] + 1] = [];
      }
      affectedArea[i - position[0] + 1][j - position[1] + 1] = board[i][j];

      if (i - position[0] >= 0 && j - position[1] >= 0
        && i - position[0] < block.length && j - position[1] < block.length
        && block[i - position[0]][j - position[1]] === 1
        && affectedArea[i - position[0] + 1][j - position[1] + 1] !== 0) {
        throw new Error('blocks folded');
      }
      if (i - position[0] >= 0 && j - position[1] >= 0
        && i - position[0] < block.length && j - position[1] < block.length
      && block[i - position[0]][j - position[1]] === 1
      && affectedArea[i - position[0] + 1][j - position[1] + 1] === 0) {
        affectedArea[i - position[0] + 1][j - position[1] + 1] = 'n';
      }
    }
  }
  let flag = false;
  for (let i = 0; i < affectedArea.length; i += 1) {
    for (let j = 0; j < affectedArea[0].length; j += 1) {
      if (affectedArea[i][j] === 'n' && (affectedArea[i - 1][j - 1] === 1
      || affectedArea[i + 1][j + 1] === 1
      || affectedArea[i - 1][j + 1] === 1 || affectedArea[i + 1][j - 1] === 1)) {
        flag = true;
      }
      if (affectedArea[i][j] === 'n' && (affectedArea[i - 1][j] === 1
      || affectedArea[i][j - 1] === 1 || affectedArea[i + 1][j] === 1
      || affectedArea[i][j + 1] === 1)) {
        throw new Error('no adjacent block');
      }
    }
  }
  if (!flag) {
    throw new Error('no block connected');
  }
  return true;
};

export const putBlockOnBoard = (
  board: (string | number)[][],
  newBlock: number[][],
  position: number[],
  rotation = 0,
  player: string,
): (string | number
  )[][] => {
  if (position.length !== 2) {
    throw new Error('position length must be 2');
  }
  if (/0-3/.test(rotation.toString())) {
    throw new Error('rotation must be included in 0-3');
  }
  const rotatedBlock = rotation === 0 ? newBlock : rotateBlock(newBlock, rotation);
  // put block on board and return board
  // 맨 왼 쪽 첫 번째 블럭(newBlock[0][0])이 들어갈 위치를 position으로 받아옴
  const currentBoard = board;
  if (isAvailableArea(currentBoard, rotatedBlock, position)) {
    const x = rotatedBlock[0].length;
    const y = rotatedBlock.length;
    for (let i = 0; i < y; i += 1) {
      for (let j = 0; j < x; j += 1) {
        if (currentBoard[position[0] + i][position[1] + j] === 0 && rotatedBlock[i][j] === 1) {
          currentBoard[position[0] + i][position[1] + j] = player;
        }
      }
    }
  }
  return currentBoard;
};
