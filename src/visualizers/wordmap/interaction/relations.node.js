const { getNodeIdFromEvent, formatField } = require("./utils");

const showNodeRelations = function(event, plot){
    var nodeId = getNodeIdFromEvent(event);
    _showNodeRelations(plot, nodeId);
}

function _showNodeRelations(plot, nodeId){
    const page = 1;
    _showNodeRelationsAux(plot,nodeId, page)
}

function _showNodeRelationsAux(plot, nodeId, page){
    const RESULTS_PER_PAGE = 10;

    plot.tooltip.clean();
    plot.tooltip.setSize(300,50);
    const relationsField = 'relations';
    const data = plot.digitalTwin.getNodeInfoById(nodeId);
    if (data.id != nodeId){ console.log('Warning at showSourceData() : Id is not consistant'); return;}
    if (!data.hasOwnProperty(relationsField)) return;
    const relations = data[relationsField];
    if (!Array.isArray(relations)) return;
    if (relations.length == 0) return;

    const startIndex = (page - 1) * RESULTS_PER_PAGE;
    const currentPage = relations.slice(startIndex, startIndex + RESULTS_PER_PAGE);

    for (let i = 0; i < currentPage.length; i++) {
        const relation = currentPage[i];
        var title = formatField(relation.label)
        title = String(i+1+startIndex) + ") " +  title;
        const weight = relation.weight;
        plot.tooltip.addLine(title);
    }

    const tooltipText = plot.tooltip.getComponents().text;
    const buttonContainer = plot.tooltip._addOneLineInsideText(tooltipText,'');
    plot.tooltip._nLines = tooltipText.selectAll('tspan').size();
    plot.tooltip._checkResize();
    buttonContainer.attr('x','100%');
    buttonContainer.style('text-anchor','end');

    // Prev Page
    if (page > 1){
    const prevButtonText = "⬅️";
    const prevButton = buttonContainer.append('tspan').text(prevButtonText);
    prevButton.on('click', ()=>{_showNodeRelationsAux(plot, nodeId, page-1)}); 
    prevButton.style('cursor','pointer');
    }

    // Next Page
    const nRelations = relations.length;
    var nPages = Math.floor(nRelations/RESULTS_PER_PAGE)
    if (nRelations % RESULTS_PER_PAGE > 0) nPages += 1;

    const pageIsLastPage = (page == nPages)
    if (pageIsLastPage == false){
    const nextButtonText = "➡️";
    const nextButton = buttonContainer.append('tspan').text(nextButtonText);
    nextButton.on('click', ()=>{_showNodeRelationsAux(plot, nodeId, page+1)});
    nextButton.style('cursor','pointer');
    }

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
    showNodeRelations,
}