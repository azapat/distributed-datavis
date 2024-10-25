const { getNodeIdFromEvent } = require("./utils");

const removeOnClick = function(event, plot){ 
    var nodeId = getNodeIdFromEvent(event);
    const {x,y,scale} = plot.getCurrentPosition();
    plot.removeElementById(nodeId);
    plot.translateVisualization(x,y,scale);
}

module.exports = {
    removeOnClick,
}
