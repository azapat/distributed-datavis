const colors = require("../../data/digitalTwin/colors");
const Component = require("../Component");
const SvgVisualization = require("../svg/SvgVisualization");
const TooltipUtils = require("../tooltip/Tooltip.utils");
const { buildWordMap } = require("../wordmap");
const WordMapUtils = require("../wordmap/utils");

class WordMapSeries extends Component {
    static defaultProperties = {
        actionOnClick: 'showvalues',
        enableTooltipChart: true,
    }

    static build(json, plotType, props){
        if (json.hasOwnProperty('info') && json.info.hasOwnProperty('timeLabels')){
            const timeLabels = json.info.timeLabels;
            props['tooltipChartProps'] = {timeLabels};
        }
        const plot = new WordMapSeries(json, plotType, props);
        return plot;
    }

    static defaultProperties = {
        buttonTitleField: 'buttonTitle',
        titleField: 'title',
        actionOnClick: 'showvalues',
        enableTooltipChart: true,
        responsiveMode: false,
        buttonsHeight : 40,
        buttonsMargin : 10,
        inactiveColor : "#08233B",
        activeColor : "#11A1F3",
        width : 200,
        height : 200,
        enableTooltipChart : false,
        tooltipChartProps : {},
        colors: ['#08233B','#08233B'],
        hideNodes: [],
    }

    constructor(data, plotType, props){
        super(data,props);
        this._currentMap = null;
        this._currentPromise = new Promise(function(resolve, reject) {
            resolve(true);
        });
        
        this._plotData = [];
        this._plots = [];
        this._plotType = plotType;
        this.setPlotData(data);
        this.initializeDiv();

        // This has to be the Last line to execute
        this.changeMap(0);
    }

    getCurrentPromise(){
        return this._currentPromise;
    }

    _normalizeData(data){
        if (data.hasOwnProperty("data")){
            data = data.data;
        }
        return data;
    }

    setPlotData(data){
        data = this._normalizeData(data);
        if (!Array.isArray(data)) return;
        this._plotData = data;
        this._plots = [];
        for (var i=0; i < data.length; i++) this._plots.push(null);
    }

    setMapUrls(mapUrls){
        if (!Array.isArray(mapUrls) || mapUrls.length == 0 || typeof(mapUrls[0]) != "string"){
            mapUrls = [];
        }
        this._mapUrls = mapUrls;
    }

    _changeTitle(mapIndex){
        const title = this._getTitle(mapIndex);
        const {titleDIV} = this.getComponents();
        titleDIV.select('h2').text(title);
    }

    _getTitle(mapIndex){
        const { titleField } = this.properties;
        var title = "";

        if (typeof(mapIndex) != 'number') return title;
        if (mapIndex >= this._plotData.length || mapIndex < 0) return title;
        
        const data = this._plotData[mapIndex];
        if (!data.hasOwnProperty(titleField)) return title;

        title = data[titleField];
        return title;
    }

    _getButtonTitle(mapIndex){
        const { buttonTitleField } = this.properties;
        var title = "";

        if (typeof(mapIndex) != 'number') return title;
        if (mapIndex >= this._plotData.length || mapIndex < 0) return title;
        
        const data = this._plotData[mapIndex];
        if (!data.hasOwnProperty(buttonTitleField)) return title;

        title = data[buttonTitleField];
        return title;
    }

    changeMap(mapIndex){
        this._currentMap?.detach();
        const mapId = "_map";
        const { responsiveMode , tooltipChartProps , enableTooltipChart } = this.properties;
        if (this.hasOwnProperty('_currentMap') && this._currentMap != null){
            var currentMap = this._currentMap;
        } else {
            var currentMap = new SvgVisualization(mapId, this.props);
        }
        currentMap.restartSVG();
        currentMap.showMessage('Loading...');

        const mapContainer = this.components.mapDIV;
        currentMap.attachOnSelection(mapContainer);

        const data = this._plotData;
        const urlField = "url";
        if (mapIndex >= data.length){
            this._currentMap = null;
            return;
        }

        this.highlightButton(mapIndex);

        const thisPlot = this._plots[mapIndex];

        // If Map was loaded previously...
        if (thisPlot != null){
            // Remove Loading messages
            d3.select('div#' + mapId).selectAll('text#loadingText').remove();
            thisPlot.refresh();
            this._currentMap = thisPlot;

            if (responsiveMode === true) this._setResponsiveConfig();

            this._changeTitle(mapIndex);
            return;
        }

        const url = data[mapIndex][urlField];
        const promise = d3.json(url).then( json => {
            const plot = buildWordMap(json, this._plotType, this.props);
            this._plots[mapIndex] = plot;

            // Remove Loading messages
            d3.select('div#' + mapId).selectAll('text#loadingText').remove();

            // Hide Legend
            const hideLegend = data[mapIndex]['hideLegend'];
            if (hideLegend === 'true' || hideLegend === true) plot.properties.hideLegend = true;

            const groups = Object.keys(plot._groupToColorIndex);
            const nGroups = groups.length;
            
            if (nGroups <= 2) {
                colors.setColorsToMindMap(plot);
            }

            const { mapDIV } = this.components;

            plot.refresh();
            currentMap.detach();
            plot.attachOnSelection(mapDIV);

            WordMapUtils.centerMap(plot);
            this._currentMap = plot;

            if (enableTooltipChart === true && plot.enableTooltip){
                TooltipUtils.createTooltip(plot);
            }
            
        }).then( () => {if (responsiveMode === true) this._setResponsiveConfig();});

        this._changeTitle(mapIndex);

        this._currentPromise = promise;
        return promise;
    }

    initializeDiv(){
        const { width } = this.properties;
        const titleId = "mapseries_title";
        const mapId = "mapseries_map";
        const buttonsId = "mapseries_buttons";

        const { mainContainer } = this.components;

        const title = mainContainer.append("div").attr("id", titleId);
        //title.style('width', this.props.width);
        title.selectAll('h2').data([null]).enter()
        .append('center').append('h2');

        const map = mainContainer.append("div").attr("id", mapId);
        const buttonsDiv = mainContainer.append('div').attr('id',buttonsId);

        buttonsDiv.selectAll('svg.expansor').data([null]).enter()
        .append('svg')
        .attr('class','expansor')
        .style('width','100%')
        .style('height','0px');

        const buttons = buttonsDiv.append("svg").attr("class", "buttons");
        const height = this.getButtonsHeight()

        buttons.attr('viewBox',`0 0 ${width} ${height}`);
        buttons.attr('width',width);

        this.components.mapDIV = map;
        this.components.buttonsDIV = buttonsDiv;
        this.components.titleDIV = title;
        this.components.buttonsSVG = buttons;

        this.addButtons();
    }

    refreshComponents(){
        if (this.responsiveMode === true){
            this._setResponsiveConfig();
            return;
        }

        const {div, titleDIV, mapDIV, buttonsSVG, buttonsDIV} = this.getComponents();

        titleDIV.style('width', this.properties.width);
        const width = this.properties.width;
        buttonsSVG.attr('width',width);
    }

    getButtonsHeight(){
        const { buttonsHeight , buttonsMargin } = this.properties;
        const BUTTON_TITLE_HEIGHT = 30;
        const height = buttonsHeight + buttonsMargin*2 + BUTTON_TITLE_HEIGHT;
        return height;
    }

    _normalizePixels(pixels){
        if (typeof(pixels) == "number") return pixels;
        if (typeof(pixels) == "string"){
            return parseFloat(pixels);
        }
        return null;
    }

    enableResponsiveMode(minWidthPixels, maxWidthPixels){
        minWidthPixels = this._normalizePixels(minWidthPixels);
        maxWidthPixels = this._normalizePixels(maxWidthPixels);

        if (typeof(minWidthPixels) != "number") return;
        if (typeof(maxWidthPixels) != "number") return;
        if (minWidthPixels <= 0) return;
        if (maxWidthPixels <= 0) return;

        this.properties.minWidthPixels = minWidthPixels;
        this.properties.maxWidthPixels = maxWidthPixels;
        this.properties.responsiveMode = true;
        this._setResponsiveConfig();
    }

    _setResponsiveConfig(){
        const { responsiveMode , minWidthPixels , maxWidthPixels } = this.properties;
        if (responsiveMode !== true) return;

        const {div, titleDIV, mapDIV, buttonsSVG, buttonsDIV} = this.getComponents();
        titleDIV
        .style("min-width",minWidthPixels+"px")
        .style('max-width', maxWidthPixels+"px")
        .style('width',null);

        mapDIV
        .style("min-width",minWidthPixels+"px")
        .style('max-width', maxWidthPixels+"px")
        .style('width',undefined)
        .style('height',undefined);

        buttonsDIV
        .style("min-width",minWidthPixels+"px")
        .style('max-width', maxWidthPixels+"px")
        .style('width',null);

        buttonsSVG.style('width','100%');
    }

    getCurrentMap(){
        return this._currentMap;
    }

    highlightButton(index){
        const { inactiveColor , activeColor } = this.properties;
        const {buttonsSVG} = this.getComponents();
        const buttons = buttonsSVG.selectAll('circle');
        buttons.attr('fill', inactiveColor)
        .attr('stroke-width',3)
        .attr('stroke',null);

        const button = buttonsSVG.selectAll(`circle[index='${index}']`);
        button.attr('fill', activeColor )
        .attr('stroke',inactiveColor);
    }


    refresh(){
        if (this._currentMap == null) return;

        this.refreshComponents();
        this._currentMap.refresh();
    }

    addButtons(){
        const { 
            buttonTitleField, buttonsMargin, buttonsHeight, inactiveColor,
            width 
        } = this.properties;
        const data = this._plotData;

        const { buttonsSVG } = this.getComponents();
        const r = buttonsHeight / 2;
        const nMaps = data.length;

        const buttonsData = [];

        for (var i=0; i< nMaps; i++){
            const mapData = data[i];
            var title = mapData[buttonTitleField] || "";
            const sectionSize = (width / nMaps)
            const x = sectionSize*(i+1) - sectionSize/2;
            const buttonData = { "index": i, "x": x, "title": title };
            buttonsData.push(buttonData);
        }

        const linesData = [];

        for (var i=1; i< nMaps; i++){
            const sectionSize = (width / nMaps)
            const x1 = sectionSize*(i) - sectionSize/2;
            const x2 = sectionSize*(i+1) - sectionSize/2;
            const data = { "x1": x1, "x2": x2 };
            linesData.push(data);
        }
        
        const thisPlot = this;

        const yPos = r + buttonsMargin;

        buttonsSVG.selectAll('line').data(linesData).enter()
        .append('line')
        .attr('x1', d => d.x1)
        .attr('x2', d => d.x2)
        .attr('y1', yPos)
        .attr('y2', yPos)
        .attr('stroke','gray')
        .attr('stroke-dasharray',7);

        buttonsSVG.selectAll('circle').data(buttonsData).enter()
        .append('circle')
        .attr('r', r)
        .attr('cy', yPos)
        .attr('cx', d => d.x)
        .attr('index', d => d.index)
        .style('cursor','pointer')
        .on('click', (action,data)=>{
            const index = data.index;
            thisPlot.changeMap(index);
        });

        const BUTTON_TITLE_WIDTH = 150;
        const BUTTON_TITLE_HEIGHT = 30;

        const buttonTitles = buttonsSVG.selectAll('svg.buttonTitle').data(buttonsData).enter()
        .append('svg')
        .attr('class','buttonTitle')
        .attr('width', BUTTON_TITLE_WIDTH)
        .attr('height', BUTTON_TITLE_HEIGHT)
        .attr('x', d => d.x - BUTTON_TITLE_WIDTH/2)
        .attr('y', d => yPos + r);
        
        buttonTitles.append('text')
        .attr('y','50%')
        .attr('x','50%')
        .attr('dominant-baseline','middle')
        .attr('text-anchor','middle')
        .text( d => d.title);
        
        buttonsSVG.selectAll('svg.text').data(buttonsData)
    }
}

module.exports = WordMapSeries;