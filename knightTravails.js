const BOARD_SIZE_MIN = 0;
const BOARD_SIZE_MAX = 7;

function getNewCoordsArray(startCoords) {
  const x0 = startCoords.x;
  const y0 = startCoords.y;
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
  constructor(startCoordsArray, endCoordsArray) {
    this.root = new Node({ x: startCoordsArray[0], y: startCoordsArray[1] });
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

  getPathFromRequiredNode() {}
}

function prettyPrint(nodesArray) {}

module.exports = function knightTravails(startCoords, endCoords) {
  // build a tree
  // build nodes on the tree until you get the node with endCoords
  // get all the nodes from that node up to a parent node
  // print the results in a pretty fashion

  const tree = new Tree(startCoords, endCoords);
  const fullPath = tree.getPathFromRequiredNode();
  return tree;
  // const pathToNeededTile = tree.getPathToNode(endCoords);
  // prettyPrint(pathToNeededTile);
};
