const LegendUtils = require("../legends/Legend.utils");
const legendUtils = require("../legends/Legend.utils");
const logo = require("../logo");
const ButtonsUtils = require("./buttons.utils");
const SvgComponent = require("./SvgComponent");

class SvgVisualization extends SvgComponent {
    static defaultProperties = {
        disableSaveButtons: false,
        enableAutoResize: false,
        enableZoom: false,
        valueField: 'value',
        initialZoom: 1,
        parentHtmlTag: 'div',

        width: 800,
        height: 600,
        minWidth: 800,
        maxWidth: 800,

        colors: [],
        colorScale: 'linear',
        subPlotField: 'subPlot',
        subPlotTypeField: 'plotType',
        actionOnClick: 'recenter',
        uniqueName: null,
        initialPosition: [0, 0],
        hideLegend: false,
    }

    static rulesProperties = {
        colors: {type:'array',subtype:'string'},
    }

    defineSetters(){
        super.defineSetters();
        this.afterSetters.hideLegend = (v) => this.hideLegend.call(this,v);
    }

    constructor(props) {
        const data = [];
        super(data, props);
        
        // Tooltip used to show messages
        this.tooltip = null;
        // Tooltip used to Draw Embedded Visualizations
        this.tooltipChart = null;
        // Tooltip subplot is a reference to the Visualization instance that uses the tooltip svg
        this.tooltipSubPlot = null;
        // Tooltip Chart Props
        this.tooltipChartProps = {};

        this._buttons = [];
        this._removedElements = [];
        this._subPlotProperties = {};
        //this._initProperties(props);
        //this.restartSVG();
    }

    /**
     * Obtains the current relative coordinates (x,y,zoom) from
     * the container translation attribute
     */
    getCurrentPosition(){
        const transform = this.getComponents().container.attr('transform');
        if (!transform) return {x:0, y:0, scale:1}
        const translateRegex = /translate\(([^)]+)\)/;
        const translate = translateRegex.exec(transform)[1];
        var x = translate.split(',')[0];
        x = parseFloat(x)
        if (isNaN(x)) x = 0;

        var y = translate.split(',')[1];
        y = parseFloat(y)
        if (isNaN(y)) y = 0;

        const scaleRegex = /scale\(([^)]+)\)/;
        var scale = scaleRegex.exec(transform)[1];
        scale = parseFloat(scale);
        
        return {x,y,scale};
    }

    getColor(group) {
        const { colors } = this.properties;
        if (group >= colors.length) {
            while (colors.length <= group) {
                var color = Math.floor(Math.random() * 16777216).toString(16);
                color = '#000000'.slice(0, - color.length) + color;
                colors.push(color);
            }
        }
        return colors[group];
    }

    // TODO : Restructure
    getScale(domain, range) {
        const {colorScale} = this.getProperties();
        switch (colorScale) {
            case 'log':
                var scale = d3.scaleSymlog();
                break;
            case 'flat':
            case 'linear':
                var scale = d3.scaleLinear();
                break;
            case 'sqrt':
                var scale = d3.scaleSqrt();
                break;
            case 'pow':
                var scale = d3.scalePow();
                break;
            default:
                var scale = d3.scaleLinear();
        }
        scale.domain(domain).nice()
            .range(range);
        return scale;
    }

    _scaleValue(value) {
        const {colorScale} = this.getProperties();
        switch (colorScale) {
            case 'log':
                const defVal = 0.0001;
                value = Math.log(value);
                return Math.max(value, defVal);
            case 'linear':
                return value;
            case 'sqrt':
                return Math.sqrt(value);
            case 'pow':
                return Math.pow(value, 2);
            case 'flat':
                return 1;
            default:
                console.log('Invalid Color scale -> ', colorScale);
                return value;
        }
    }

    cleanSVG() {
        const { outerSVG } = this.getComponents();
        outerSVG.remove();
    }

    restartSVG() {
        this.cleanSVG();
        this.initComponents();
        this.reattach();
    }

    calculateInnerSize() {
        var { margin, width, height } = this.getProperties();
        const innerWidth = width - margin.left - margin.right;
        const innerHeight = height - margin.top - margin.bottom;
        return { innerWidth , innerHeight };
    }

    _setTextProperties(text) {
        var { fontSize, fontFamily } = this.getProperties();
        text
            .style('font-size', fontSize + 'px')
            .style('font-family', fontFamily);
    }

    _refreshComponents() {
        const { mainContainer, outerSVG, innerSVG, container, background } = this.components;
        const {
            width, height, margin, backgroundColor,
            maxWidth, minWidth, autoResize,enableZoom,
        } = this.properties;

        const {innerWidth,innerHeight} = this.calculateInnerSize();

        outerSVG.attr('viewBox', `0 0 ${width} ${height}`);

        background.attr('fill', backgroundColor);

        innerSVG
            .attr('width', innerWidth)
            .attr('height', innerHeight);

        const minZoom = 0.03;
        const maxZoom = 2;
        const zoom = d3.zoom().scaleExtent([minZoom,maxZoom]).on('zoom', handleZoom);

        function handleZoom(event){
            container.attr('transform', event.transform);
        }

        if (enableZoom) {
            innerSVG.call(zoom);
        } else {
            innerSVG.call(zoom.on('zoom', null));
        }

        mainContainer.style('height', height + 'px')
            .style('width', width + 'px');

        if (autoResize === true) {
            mainContainer.style('max-width', maxWidth)
                .style('min-width', minWidth)
                .style('height', 'unset')
                .style('width', '100%')
        }

        legendUtils.initLegend(this);
        logo.refreshLogo(this);
    }

    getStorableComponent() {
        var { outerSVG } = this.getComponents();
        return outerSVG;
    }

    showMessage(message) {
        this.cleanSVG()
        const { mainContainer } = this.getComponents()
        mainContainer.append("text")
            .text(message)
            .attr('id', 'loadingText')
            .attr("x", 0)
            .attr("y", 30)
    }

    setTitle(title) {
        if (title == null || typeof (title) != "string") return;

        title = title.replace(/_/g, ' ');

        this._title = title;
        this._showTitle();
    }

    _showTitle() {
        const title = this._title;
        const { titleSVG } = this.getComponents();
        titleSVG.style('display', 'unset');
        titleSVG.select('text').text(title);
    }

    setLegend(legends){
        this._legends = legends;
        legendUtils.initLegend(this);
    }


    // Custom Setters
    hideLegend(hide){
        if (this.components == null) return;
        if (hide){
            LegendUtils.hideLegend(this);
        } else {
            LegendUtils.showLegend(this);
        }
    }
}

module.exports = SvgVisualization;