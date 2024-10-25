function getNodeIdFromEvent(event){
    var nodeId = event.target.nearestViewportElement.getAttribute('nodeId');
    nodeId = parseInt(nodeId);
    return nodeId;
}

function formatField(label){
    if (typeof(label) != "string") return label;
    label = label.replaceAll('_',' ');
    label = label.replace(/(^\w{1})|(\s+\w{1})/g, letter => letter.toUpperCase());
    return label;
}

module.exports = {
    getNodeIdFromEvent,
    formatField,
}