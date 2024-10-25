const DigitalTwin = require("../../data/digitalTwin/DigitalTwin");
const GraphToMap = require("../../data/digitalTwin/GraphToMap");
const WideGraphToMap = require("../../data/digitalTwin/WideGraphToMap");
const HexagonMap = require("./HexagonMap");
const DigitalTwinProcessing = require("../../data/digitalTwin/DigitalTwinProcessing");
const { HexagonMapWithTimeSeries } = require("./HexagonMapWithTimeSeries");

function buildWordMap(json, plotType = 'hexagon', props = {}) {
    var plotType = plotType.toLowerCase();

    if (props == null || props.constructor.name != 'Object') {
        props = {}
    }

    if (!['hexagon', 'square'].includes(plotType)) {
        console.log('Error at BuildWordMap() invalid plotType ' + plotType)
        return null
    }

    const isWideMap = (props.hasOwnProperty('onlyNearestNeighbours') && props['onlyNearestNeighbours'] === true)

    json = DigitalTwinProcessing.normalizeMindMapJson(json);

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
    
    return plot;
}


module.exports = {
    buildWordMap
};