import { getNodeIdFromEvent  } from "./utils";

const removeOnClick = function(event, plot){ 
    var nodeId = getNodeIdFromEvent(event);
    const {x,y,scale} = plot.getCurrentPosition();
    plot.removeElementById(nodeId);
    plot.translateVisualization(x,y,scale);
}

export {
    removeOnClick,
}
