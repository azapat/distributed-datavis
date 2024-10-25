const { getNodeIdFromEvent } = require("./utils");

function recenterOnClick(event,plot){
    const { nameField } = plot.getProperties();
    if (plot.graphToMap == null) return;
    var nodeId = getNodeIdFromEvent(event);
    var nodeInfo = plot.graphToMap.digitalTwin.getNodeInfoById(nodeId);
    const nodeLabel = nodeInfo[nameField];
    // Reorganizes map around clicked concept
    plot.modifyCentralNode(nodeId);
    // Must be executed after map is reorganized
    const zoom = 0.75;
    plot.centerCamera(nodeLabel, zoom);
}

module.exports = {
    recenterOnClick,
}