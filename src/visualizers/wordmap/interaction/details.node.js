const { formatField, getNodeIdFromEvent } = require("./utils");

const showNodeDetails = function(event,plot){
    var nodeId = getNodeIdFromEvent(event);
    _showNodeDetails(plot, nodeId);
}


function _showNodeDetails(plot, nodeId){
    const RESULTS_PER_PAGE = 10;

    plot.tooltip.clean();
    plot.tooltip.setSize(300,50);
    const data = plot.digitalTwin.getNodeInfoById(nodeId);
    if (data.id != nodeId){ console.log('Warning at showSourceData() : Id is not consistant'); return;}

    const fields = [
    'id','label','value','unique_value','weight',
    'normalized_value','group','original_label',
    ];
    
    fields.forEach((field)=>{
    if (data[field] == null) return;
    const value = data[field];
    const formattedKey = formatField(field);
    plot.tooltip.addKeyValue(formattedKey,value);
    });

    const tooltipText = plot.tooltip.getComponents().text;
    const buttonContainer = plot.tooltip._addOneLineInsideText(tooltipText,'');
    plot.tooltip._nLines = tooltipText.selectAll('tspan.tooltipLine').size();
    plot.tooltip._checkResize();
    buttonContainer.attr('x','100%');
    buttonContainer.style('text-anchor','end');

    const node = d3.selectAll('svg.concept').filter(function(){
    var id = d3.select(this).attr('nodeId');
    return id == String(nodeId);
    });

    if (node.size == 0) return;
    const x = node.attr('x');
    const y = node.attr('y') - plot.tooltip.properties.height + 0;
    plot.tooltip.move(x,y);
    plot.tooltip.show();
}

module.exports = {
    showNodeDetails,
}