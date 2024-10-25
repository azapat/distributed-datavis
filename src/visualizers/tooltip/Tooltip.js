const SvgVisualization = require("../svg/SvgVisualization");
const VisualUtils = require("../visual.utils");

class Tooltip extends SvgVisualization {
    constructor(plotId, props) {
        props.enableZoom = false;
        if (!props.hasOwnProperty('parentHtmlTag')){
            props['parentHtmlTag'] = 'svg';
        }
        props.initialHeight = props.height;
        props.initialWidth = props.width;
        super(plotId, props);
        this._nLines = 0;
    }

    setSize(width, height, isDinamicIncrease = false) {
        if (width > 0) this.properties.width = width;
        if (height > 0) this.properties.height = height;
        if (isDinamicIncrease === false) {
            this.properties.initialWidth = this.properties.height;
            this.properties.initialHeight = this.properties.width;
        }
        this._refreshComponents();
    }

    _checkResize() {
        const { fontSize } = this.getProperties();
        const height =  this.calculateInnerSize().innerHeight;
        const textHeight = this._nLines * fontSize * 1.1;
        if (textHeight > height) {
            const diff = textHeight - height;
            var isDinamicIncrease = true;
            this.setSize(this.properties.width, this.properties.height + diff, isDinamicIncrease);
        }
    }

    _createTooltipBackground() {
        const { outerSVG } = this.getComponents();
        outerSVG
            .style('opacity', 1)
            .style('font-weight', 'normal')
            .style('text-align', 'center')
            .style('border-radius', '6px')
            .style('border', '0px')
            .style('display', 'inline');

        const back = outerSVG.selectAll('rect.background')
            .data([null]).enter()
            .append('rect')
            .attr('class', 'background')
            .attr('width', '100%')
            .attr('height', '100%')
            .attr('fill', this.properties.backgroundColor)
            .lower();
    }

    initComponents() {
        //this.setSize(this.properties.initialWidth, this.properties.initialHeight);
        super.initComponents();
        const { innerSVG, container, mainContainer } = this.getComponents();
        const { fontFamily, fontSize } = this.getProperties();
        const { innerWidth } = this.calculateInnerSize();

        mainContainer.style('transition', 'visibility 0.5s')
            .on('mouseover', d => this.show())
            .on('mouseout', d => this.hide());

        innerSVG.select('rect.background').remove();
        this._createTooltipBackground();
        container.selectAll('text.text').data([null])
            .enter()
            .append('text')
            .attr('class', 'text')
            .style('width', innerWidth)
            .style('display', 'block')
            .style('font-size', fontSize + 'px')
            .style('font-family', fontFamily)
            .attr('y', '1em')
            .attr('x', '0%');
    }

    _refreshComponents() {
        super._refreshComponents();
        const { mainContainer } = this.getComponents();
        const { width, height } = this.getProperties();
        mainContainer.attr('height', height + 'px')
            .attr('width', width + 'px');
    }

    getComponents() {
        const components = super.getComponents();
        components.text = components.container.select('text.text');
        components.background = components.outerSVG.select('rect.background');
        return components;
    }

    _addOneLineInsideText(text, line) {
        const x = text.attr('x');
        var lineHeight = 1.1; // ems
        if (text.selectAll('tspan.tooltipLine').size() == 0) {
            lineHeight = 0;
        }
        var tspan = text.append('tspan').attr('class', 'tooltipLine');

        tspan.text(line)
            .attr('x', x)
            .attr('dy', lineHeight + 'em');

        return tspan;
    }

    _addLinesInsideText(text, lines) {
        lines.forEach(line => this._addOneLineInsideText(text, line));
    }

    _addOneLinkInsideText(text, url, label) {
        const x = text.attr('x');
        var lineHeight = 1.1; // ems
        if (text.selectAll('tspan.tooltipLine').size() == 0) {
            lineHeight = 0;
        }
        const link = text.append('a')
            .append('tspan')
            .attr('class', 'tooltipLine')
            .text(label)
            .attr('x', x)
            .attr('dy', lineHeight + 'em');

        link.on('click', () => { window.open(url, "_blank") });
        link.style('cursor', 'pointer');

        return link;
    }

    _addLinksInsideText(text, urls, labels) {
        var thisPlot = this;
        urls.forEach(function (url, i) { thisPlot._addOneLinkInsideText(text, url, labels[i]) });
    }

    move(x, y) {
        const { mainContainer } = this.getComponents();
        if (x !== null) mainContainer.attr('x', x);
        if (y !== null) mainContainer.attr('y', y);
    }

    hide() {
        const { mainContainer } = this.getComponents();
        mainContainer.style('visibility', 'hidden');
        this._hideAux();
    }

    // Custom Steps After hidding
    _hideAux() { }

    executeFunctionAfterHide(func) {
        if (typeof (func) != 'function') return;
        this._hideAux = func;
    }

    show() {
        const { mainContainer } = this.getComponents();
        mainContainer.style('visibility', 'unset');
        mainContainer.style('opacity', '1.0');
        this._showAux();
    }

    // Custom Steps After Showing
    _showAux() { }

    executeFunctionAfterShowing(func) {
        if (typeof (func) != 'function') return;
        this._showAux = func;
    }

    addLine(line) {
        const { text } = this.getComponents();
        const width =  this.calculateInnerSize().innerWidth;
        //var lines = VisualUtils.getSplittedText(line, width, text);
        var lines = [line];
        if (line === '\n') var lines = [' '];
        this._addLinesInsideText(text, lines);
        this._nLines = text.selectAll('tspan.tooltipLine').size();
        this._checkResize();
    }

    addKeyValue(key, value) {
        const { text } = this.getComponents();

        const x = text.attr('x');
        var lineHeight = 1.1; // ems
        if (text.selectAll('tspan.tooltipLine').size() == 0) {
            lineHeight = 0;
        }
        var tspan = text.append('tspan')
            .attr('class', 'tooltipLine')
            .attr('x', x)
            .attr('dy', lineHeight + 'em')
            .style('margin', '20px');

        tspan.append('tspan')
            .text(`${key}: `)
            .style('font-weight', 'bold')

        tspan.append('tspan')
            .text(`${value}`)


        this._nLines = text.selectAll('tspan.tooltipLine').size();
        this._checkResize();
    }

    addLink(url, label) {
        const { text } = this.getComponents();
        const width =  this.calculateInnerSize().innerWidth;
        //const labels = VisualUtils.getSplittedText(label, width, text);
        const labels = [label];
        const urls = [];
        labels.forEach(d => urls.push(url));
        this._addLinksInsideText(text, urls, labels);
        this._nLines = text.selectAll('tspan.tooltipLine').size();
        this._checkResize();
    }

    clean() {
        const { text } = this.getComponents();
        text.selectAll('tspan').remove();
        text.selectAll('a').remove();
        this._nLines = 0;
    }
}

module.exports = Tooltip;