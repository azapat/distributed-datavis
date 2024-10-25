function exportPng(plot){
    saveVisualization(plot,'png');
}

function exportSvg(plot){
    saveVisualization(plot,'svg');
}

function saveVisualization(plot, format){
    format = format.toLowerCase();
    var saveFunction = ()=>{};

    if (format == 'png'){
        saveFunction = saveSvgAsPng;
    } else if (format == 'svg'){
        saveFunction = saveSvg;
    } else {
        console.log(`Error at saveVisualization() -> incorrect format ${format}`);
        return;
    }

    const currentPlot = plot;
    const components = currentPlot.getComponents();
    if (components.hasOwnProperty('outerSVG')) var internalButtons = components.outerSVG.selectAll('svg.button');
    else var internalButtons = d3.select();
    internalButtons.style('display','none');
    var svgToPlot = currentPlot.getStorableComponent();

    const translateBackup = svgToPlot.attr('transform');
    svgToPlot.attr('transform','translate(0,0) scale(1)');

    if (currentPlot._uniqueName != null){
      var fileName = `${currentPlot._uniqueName}.${format}`;
    } else {
      var fileName = `plot.${format}`;
    }
    
    saveFunction(svgToPlot.node(),fileName)
    .then( () => internalButtons.style('display','unset'))
    .then( () => {
        svgToPlot.attr('transform',translateBackup);
    });
}


const save = {
    exportPng,
    exportSvg,
}

module.exports = save;