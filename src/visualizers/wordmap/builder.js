const DigitalTwin = require("../../data/digitalTwin/DigitalTwin");
const GraphToMap = require("../../data/digitalTwin/GraphToMap");
const WideGraphToMap = require("../../data/digitalTwin/WideGraphToMap");
const HexagonMap = require("./HexagonMap");
const DigitalTwinProcessing = require("../../data/digitalTwin/DigitalTwinProcessing");
const { HexagonMapWithTimeSeries } = require("./HexagonMapWithTimeSeries");
const colors = require("../../data/digitalTwin/colors");
const { normalizeValue } = require("../../properties/utils");
const { preprocessLegend } = require("../legends/Legend.utils");

function buildWordMap(json, plotType = 'hexagon', props = {}) {
    var plotType = plotType.toLowerCase();

    if (props == null || props.constructor.name != 'Object') {
        props = {}
    }

    props['onlyNearestNeighbours'] = normalizeValue('boolean',props['onlyNearestNeighbours']);
    props['relevancyMode'] = normalizeValue('boolean', props['relevancyMode']);

    json = DigitalTwinProcessing.normalizeMindMapJson(json);
    preprocessProperties(json, props);

    if (!['hexagon', 'square'].includes(plotType)) {
        console.log('Error at BuildWordMap() invalid plotType ' + plotType)
        return null
    }

    const isWideMap = props['onlyNearestNeighbours'];

    // Build MindMap
    const digitalTwin = new DigitalTwin(json, props);

    var processor;
    if (isWideMap === true) {
        processor = new WideGraphToMap(digitalTwin, plotType, props);
    } else {
        processor = new GraphToMap(digitalTwin, plotType, props);
    }

    const locatedNodes = processor.getLocatedNodes();
    var plot = null;

    const timeSeriesField = props.timeSeriesField || 'values';
    const hasTimeSeries = DigitalTwinProcessing.hasTimeSeries(json,timeSeriesField);

    if (plotType == 'hexagon' && hasTimeSeries){
        plot = new HexagonMapWithTimeSeries(props);
    } else if (plotType == 'hexagon') {
        plot = new HexagonMap(props);
    } else if (plotType == 'square') {
        //plot = new SquareMap(props);
        console.log('SquareMap has not been migrated to new structure');
        return;
    } else {
        console.log('Error at BuildWordMap() Unexpected plot type:', plotType)
        return;
    }

    plot.setGraphToMap(processor);
    plot.data = locatedNodes;
    plot.setLegend(json.legends);

    postProcessProperties(plot,props);

    // If custom colors are not assigned, uses default ones
    if (!Array.isArray(props.colors)) colors.setColorsToMindMap(plot);
    
    return plot;
}

function preprocessProperties(data, props){
    preprocessLegend(props, data);

    if (props.relevancyMode === true){
        props.colorScale = 'flat';
        props.categoryField = 'weight';
        props.colors = ['#cc3232','#db7b2b','#e7b416','#99c140','#2dc937'];
        const legends = {'1':'Weight 1','2':'Weight 2','3':'Weight 3','4':'Weight 4','5':'Weight 5'};
        data.legends = legends;
    }

    if (typeof(props.showNumber) == "string"){
        props.valueFieldToShow = props.showNumber;
        props.hideNumber = false;
        delete props.showNumber;
    }  
}

function postProcessProperties(plot, props){
    if (props.relevancyMode === true){
        var groupToColorIndex = { "1":0, "2":1, "3":2, "4":3, "5":4}
        plot._groupToColorIndex = groupToColorIndex;
    }
}


module.exports = {
    buildWordMap
};