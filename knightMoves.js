const BOARD_SIZE_MIN = 0;
const BOARD_SIZE_MAX = 7;

function getNewCoordsArray(startCoordsArray) {
  const x0 = startCoordsArray.x;
  const y0 = startCoordsArray.y;
  return [
    { x: x0 + 2, y: y0 + 1 },
    { x: x0 + 2, y: y0 - 1 },
    { x: x0 - 2, y: y0 + 1 },
    { x: x0 - 2, y: y0 - 1 },
    { x: x0 + 1, y: y0 + 2 },
    { x: x0 + 1, y: y0 - 2 },
    { x: x0 - 1, y: y0 + 2 },
    { x: x0 - 1, y: y0 - 2 },
  ];
}

function isNotYetPresentInTree(coords, chessBoardObj) {
  return !chessBoardObj.board[coords.y][coords.x];
}

function isInRange(coords) {
  return (
    coords.x >= BOARD_SIZE_MIN &&
    coords.x <= BOARD_SIZE_MAX &&
    coords.y >= BOARD_SIZE_MIN &&
    coords.y <= BOARD_SIZE_MAX
  );
}

class ChessBoard {
  constructor(startCoordsObj) {
    this.board = this.#setupRowsAndColumns();
    this.setTileAsUsedOne(startCoordsObj);
  }

  #setupRowsAndColumns() {
    return Array.from({ length: 8 }, () => {
      return Array.from({ length: 8 }, () => false);
    });
  }

  setTileAsUsedOne(coordsObj) {
    this.board[coordsObj.x][coordsObj.y] = true;
  }
}

class Node {
  constructor(coords, parentNode) {
    this.x = coords.x;
    this.y = coords.y;
    this.parentNode = parentNode;
    this.children = [];
  }
}

class Tree {
  constructor(startCoordsArrayArray, endCoordsArray) {
    this.root = new Node({
      x: startCoordsArrayArray[0],
      y: startCoordsArrayArray[1],
    });
    this.#setupTree(endCoordsArray);
  }

  #setupTree(endCoordsArray) {
    const startCoordsObj = { x: this.root.x, y: this.root.y };
    const queue = [];
    const chessBoardObj = new ChessBoard(startCoordsObj);
    let reachedRequiredCoord = false;
    let currentNode = this.root;

    while (true) {
      if (reachedRequiredCoord) break;
      if (queue.length > 0) {
        currentNode = queue.shift();
      }

      const currentNodeCoords = {
        x: currentNode.x,
        y: currentNode.y,
      };

      const newCoordsArray = getNewCoordsArray(currentNodeCoords);
      const validCoordsArray = newCoordsArray.filter((coords) => {
        return (
          isInRange(coords) && isNotYetPresentInTree(coords, chessBoardObj)
        );
      });

      // We need an array of valid nodes separately in order to have no trouble setting up
      // this.nodeWithEndCoords tree property
      const nodesWithValidCoords = [];
      for (let coords of validCoordsArray) {
        chessBoardObj.setTileAsUsedOne(coords);

        const node = new Node(coords, currentNode);
        currentNode.children.push(node);
        nodesWithValidCoords.push(node);
        queue.push(node);
      }

      // Stop tree creation if we've reached required tile
      for (let node of nodesWithValidCoords) {
        if (node.x === endCoordsArray[0] && node.y === endCoordsArray[1]) {
          this.nodeWithEndCoords = node;
          reachedRequiredCoord = true;
        }
      }
    }
  }

  getPathFromRequiredNode() {
    const allNodesFromRequiredNode = [
      { x: this.nodeWithEndCoords.x, y: this.nodeWithEndCoords.y },
    ];

    let parentNode = this.nodeWithEndCoords.parentNode;
    while (parentNode) {
      allNodesFromRequiredNode.unshift({ x: parentNode.x, y: parentNode.y });
      parentNode = parentNode.parentNode;
    }
    return allNodesFromRequiredNode;
  }
}

function prettyPrint(startCoordsArray, endCoordsArray, pathToNeededTileArray) {
  console.log(
    `> knightMoves([${startCoordsArray[0]},${startCoordsArray[1]}],[${endCoordsArray[0]},${endCoordsArray[1]}])`
  );
  console.log(
    `You made it in ${pathToNeededTileArray.length} moves! Here's your path:`
  );
  for (let coords of pathToNeededTileArray) {
    console.log(`[${coords.x},${coords.y}]`);
  }
}

module.exports = function knightMoves(startCoordsArray, endCoordsArray) {
  const tree = new Tree(startCoordsArray, endCoordsArray);
  const pathToNeededTileArray = tree.getPathFromRequiredNode();
  prettyPrint(startCoordsArray, endCoordsArray, pathToNeededTileArray);
};
