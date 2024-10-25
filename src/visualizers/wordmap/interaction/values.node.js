const { TooltipVisualizer } = require("../../tooltip/TooltipVisualizer");
const { getNodeIdFromEvent } = require("./utils");

function showValuesOnClick(event,plot){
    console.log({event,plot});
    console.log([plot.graphToMap, ])
    if (plot.graphToMap == null) return;
    if (plot.tooltipSubPlot == null) return;
    var nodeId = getNodeIdFromEvent(event);
    var nodeInfo = plot.graphToMap.digitalTwin.getNodeInfoById(nodeId);
    console.log({nodeId,nodeInfo})
    const valuesField = 'values';
    const {nameField} = plot.getProperties();
    if (nodeInfo.hasOwnProperty(valuesField)){
        const json = nodeInfo[valuesField];
        const title = nodeInfo[nameField];
        plot.tooltipSubPlot.plot(json);
        plot.tooltipSubPlot.setTitle(title);
        TooltipVisualizer._showTooltipChart(plot);
    }
}

module.exports = {
    showValuesOnClick,
}