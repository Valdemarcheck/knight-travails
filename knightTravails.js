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

function isNotYetPresentInTree(coords, usedCoordsArray) {
  // console.log("Used coords: ", usedCoordsArray);
  return usedCoordsArray.every((currentCoords) => {
    // console.log(
    //   "Current: ",
    //   coords,
    //   "Next: ",
    //   currentCoords,
    //   coords.x !== currentCoords.x || coords.y !== currentCoords.y
    // );
    return coords.x !== currentCoords.x || coords.y !== currentCoords.y;
  });
}

function isInRange(coords) {
  return (
    coords.x >= BOARD_SIZE_MIN &&
    coords.x <= BOARD_SIZE_MAX &&
    coords.y >= BOARD_SIZE_MIN &&
    coords.y <= BOARD_SIZE_MAX
  );
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
    // setup root node
    const usedCoordsArray = [{ x: this.root.x, y: this.root.y }];
    const queue = [];
    let reachedRequiredCoord = false;
    let currentNode = this.root;

    // let i = 0;
    while (true) {
      // i++;
      if (reachedRequiredCoord) break;
      if (queue.length > 0) {
        currentNode = queue.shift();
      }
      // console.log("Used coords: ", usedCoordsArray);

      // get an array of new coordinates
      const currentNodeCoords = {
        x: currentNode.x,
        y: currentNode.y,
      };
      // console.log(currentNodeCoords);
      const newCoordsArray = getNewCoordsArray(currentNodeCoords);
      // console.log("ALL");
      // console.log(newCoordsArray);

      // exclude negative ones
      // exclude recurring ones
      const validCoordsArray = newCoordsArray.filter((coords) => {
        return (
          isInRange(coords) && isNotYetPresentInTree(coords, usedCoordsArray)
        );
      });
      // console.log("VALID");
      // console.log(validCoordsArray);

      // add valid coordinates to used ones
      // make nodes out of new coordinates. Add them to current node. then add those nodes to a queue. dequeue the queue and make that node a current one
      const nodesWithValidCoords = [];
      for (let coords of validCoordsArray) {
        usedCoordsArray.push({ x: coords.x, y: coords.y });
        const node = new Node(coords, currentNode);
        currentNode.children.push(node);
        nodesWithValidCoords.push(node);
        queue.push(node);
      }
      // if there is needed coord, leave the loop
      for (let node of nodesWithValidCoords) {
        if (node.x === endCoordsArray[0] && node.y === endCoordsArray[1]) {
          this.nodeWithEndCoords = node;
          reachedRequiredCoord = true;
        }
      }
      // console.log("==========");
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

module.exports = function knightTravails(startCoordsArray, endCoordsArray) {
  // build a tree
  // build nodes on the tree until you get the node with endCoordsArray
  // get all the nodes from that node up to a parent node
  // print the results in a pretty fashion

  const tree = new Tree(startCoordsArray, endCoordsArray);
  const pathToNeededTileArray = tree.getPathFromRequiredNode();
  prettyPrint(startCoordsArray, endCoordsArray, pathToNeededTileArray);
};
