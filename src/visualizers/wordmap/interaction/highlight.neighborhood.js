const { getNodeIdFromEvent } = require("./utils");

const highlightOnClick = function(event,plot){
    var nodeId = getNodeIdFromEvent(event);
    plot._highlightNode(nodeId);
}

module.exports = {
    highlightOnClick,
}

