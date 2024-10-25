const { ListVisualizer } = require("./ListVisualizer");

class JobVisualizer extends ListVisualizer {
    constructor(plotId, props){
        super(plotId, props);
    }
}

module.exports = {
    JobVisualizer,
}