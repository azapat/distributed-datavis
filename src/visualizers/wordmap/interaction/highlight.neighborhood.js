import { getNodeIdFromEvent  } from "./utils";

const highlightOnClick = function(event,plot){
    var nodeId = getNodeIdFromEvent(event);
    plot._highlightNode(nodeId);
}

export {
    highlightOnClick,
}

