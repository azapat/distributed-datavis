import HexagonMap from "./HexagonMap";
import WordMap from "./WordMap";

import { buildWordMap  } from "./builder";
import interaction from "./interaction";
import { centerMap  } from "./utils";

const wordmap = {
    WordMap,
    HexagonMap,
    //SquareMap,
    buildWordMap,
    centerMap,
    interaction,
}

export { WordMap, HexagonMap, buildWordMap, centerMap, interaction };
export default wordmap;