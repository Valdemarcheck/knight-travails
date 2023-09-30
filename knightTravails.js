class Node {
  constructor(coords, parentNode) {
    this.x = coords.x;
    this.y = coords.y;
    this.parentNode = parentNode;
    this.children = [];
  }
}

class Tree {
  constructor(startCoords, endCoords) {
    this.root = this.#setupTree(startCoords, endCoords);
  }

  #setupTree(startCoords, endCoords) {}

  #LDRSearch(coords) {}

  getPathToNode(coords) {
    const node = this.#LDRSearch(coords);
  }
}

function prettyPrint(nodesArray) {}

module.exports = function knightTravails(startCoords, endCoords) {
  const tree = new Tree(startCoords, endCoords);
  // build a tree
  // build nodes on the tree until you get the node with endCoords
  // get all the nodes from that node up to a parent node
  const pathToNeededTile = tree.getPathToNode(endCoords);
  // print the results in a pretty fashion
  prettyPrint(nodesArray);
};
