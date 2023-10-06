const knightMoves = require("./knightMoves");

// Tests
knightMoves([0, 0], [1, 2]); // [[0,0],[1,2]]
knightMoves([0, 0], [3, 3]); // [[0,0],[2,1],[3,3]]
knightMoves([3, 3], [0, 0]); // [[3,3],[1,2],[0,0]]
