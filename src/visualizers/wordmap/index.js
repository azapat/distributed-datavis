const HexagonMap = require("./HexagonMap");
const WordMap = require("./WordMap");

const { buildWordMap } = require("./builder");
const interaction = require("./interaction");
const { centerMap } = require("./utils");

const wordmap = {
    WordMap,
    HexagonMap,
    //SquareMap,
    buildWordMap,
    centerMap,
    interaction,
}

module.exports = wordmap;