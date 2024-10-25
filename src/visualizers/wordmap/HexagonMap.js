const { initializeButtons } = require("./interaction");
const HexagonUtils = require("./hexagon.utils");
const WordMap = require("./WordMap");
const VisualUtils = require('../visual.utils');
const logo = require("../logo");

class HexagonMap extends WordMap {
    static defaultProperties = {
        strokeWidth: 3,
        strokeColor: '#000000',
        figSize: 70,
        spaceBetweenFigures: 0.5,
        width: 800,
        height: 600,
        enableZoom: true,
        nameField: 'label',
    }

    constructor(plotId, props) {
        super('hexagon', plotId, props);
    }

    centerCamera(label, zoom) {
        const {
            defaultCamera, width, height,
        } = this.getProperties();

        if (typeof (zoom) !== 'number') return;
        //if (defaultCamera == true) return;
        if (typeof (label) !== 'string' || label.length == 0) label = this.graphToMap.properties.centerNode;

        if (!this.digitalTwin.hasLabel(label)) {
            console.log(`Error at centerCamera() : Label "${label}" was not found`);
            this.properties.defaultCamera = true;
            this.properties.centerCameraAround = null;
            return;
        }

        const {x,y} = HexagonUtils.getRelativeHexagonPosition(this,label,zoom);
        this.properties.initialZoom = zoom;
        this.properties.initialPosition = [x,y];
        this.properties.centerCameraAround = label;
        this.translateVisualization(x,y,zoom);
    }

    draw(data) {
        this.restartSVG();
        super.draw(data);
        this._validateParameters();

        var {
            initialZoom, categoryField, nameField,
            centerNodeId, showZoomButtons,
            spaceBetweenFigures, enableTooltip,
            hideNumber, showActionButtons, initialZoom, centerCameraAround,
        } = this.getProperties();

        
        var This = this;
        this.setData(data);
        if (data.length == 0) return;

        if (showActionButtons) initializeButtons(this);
        this.showActionButtons(showActionButtons);

        // Initial Geometrical Calculations
        var hexaRadius = this.properties.figSize;
        var hexaHeight = hexaRadius * 2;        // Calculates Width of the Hexagons with specified radius
        var hexaWidth = hexaRadius * Math.sqrt(3);      // Calculates Width of the Hexagons ...
        var rows = Math.max.apply(Math, data.map(function (o) { return o.y; })) + 1;
        var cols = Math.max.apply(Math, data.map(function (o) { return o.x; })) + 1;
        var height = (rows + 1 / 3) * 3 / 2 * hexaRadius;    // Calculates height of the window with given rows and radius
        var width = (cols + 1 / 2) * Math.sqrt(3) * hexaRadius; // Calculates width of ...

        const { container } = this.getComponents();

        var svg = container;
        var hexbin = d3.hexbin()
            .radius(hexaRadius)
            .extent([[0, 0], [width, height]]);

        var concepts = svg.selectAll('svg.concept')
            .data(data).enter()
            .append('svg')
            .attr('class', 'concept')
            .attr('nodeId', d => d.id)
            .attr('height', hexaHeight).attr('width', hexaWidth)
            .attr('x', function (d) {
                var cx = HexagonUtils.getHexagonCenter(hexaRadius, d.y, d.x)[0];
                return cx - hexaWidth / 2
            })
            .attr('y', function (d) {
                var cy = HexagonUtils.getHexagonCenter(hexaRadius, d.y, d.x)[1];
                return cy - hexaHeight / 2
            })

        concepts.on("mouseover", function (d) {
            if (This.getProperties().mouseOver === false) return;
            if (['highlight'].includes(This.properties.actionOnClick)) return;
            var nodeId = this.getAttribute('nodeId');
            nodeId = parseInt(nodeId);
            This._highlightNode(nodeId);
        });

        concepts.on("mouseout", function (d) {
            if (This.getProperties().mouseOver === false) return;
            if (['highlight'].includes(This.properties.actionOnClick)) return;
            if (enableTooltip === true) This.tooltip.hide();
            var nodeId = this.getAttribute('nodeId');
            This._unHighlightNode(nodeId);
        });

        concepts.on('click', (event,plot)=>{this._actionOnClickFunction(event,plot)});

        concepts.on('contextmenu', function (event) {
            event.preventDefault();
            var nodeId = this.getAttribute('nodeId');
            var nodeInfo = This.graphToMap.digitalTwin.getNodeInfoById(nodeId);
            if (!nodeInfo.hasOwnProperty('tooltipInfo') && This._obtainTooltipData != null) This._obtainTooltipData(event);
            This._showTooltipInfo(nodeId);
        });

        var maxValue = data.sort(
            function (a, b) { return parseFloat(b['value']) - parseFloat(a['value']); })[0]['value'];

        maxValue = This._scaleValue(maxValue);

        var hexagons = concepts.append('path').attr('d', hexbin.hexagon(hexaRadius - spaceBetweenFigures))
            .attr('transform', function (d) {
                return 'translate(' + hexaWidth / 2 + ',' + hexaHeight / 2 + ')'
            })

        hexagons.attr('fill', function (d) {
            var value = d.value;
            value = This._scaleValue(value);
            var percentBrightness = VisualUtils.scaleBrightness(value, maxValue);
            var color = This.getColor(d[categoryField]),
                color = VisualUtils.increaseBrightness(color, percentBrightness);
            return color
        });

        var text = concepts.append('text')
            .attr('class', 'textInside')
            .attr('x', '50%')
            .attr('y', '40%')
            .style('pointer-events', 'none')
            .attr('text-anchor', 'middle')
            .attr('dominant-baseline', 'middle')
            .attr('fill', function (d) {
                var value = d.value;
                value = This._scaleValue(value);
                var percentBrightness = VisualUtils.scaleBrightness(value, maxValue);
                var color = This.getColor(d[categoryField]),
                    color = VisualUtils.increaseBrightness(color, percentBrightness);
                color = VisualUtils.invertColor(color);
                return color;
            }).text(function (d) {
                var line = d[nameField];
                const conceptHasField = d.hasOwnProperty(This.valueFieldToShow);
                const isNumerical = !isNaN(d[This.valueFieldToShow]);
                if (!hideNumber && conceptHasField && isNumerical) line = line + '\t(' + d[This.valueFieldToShow] + ')';
                return line.replace(/_/g, ' ');
            });

        this._setTextProperties(text);

        text.call(VisualUtils.wrapLines, hexaWidth);

        text.each(function (d) {
            var text = d3.select(this)
            var nLines = text.selectAll('tspan').size();
            if (nLines >= 5) text.attr('y', '25%');
            if (nLines == 4) text.attr('y', '35%');
            if (nLines == 1) text.attr('y', '45%');
        });

        this.#drawBorders(svg, hexaRadius);

        if (enableTooltip) {
            this.tooltip.getComponents().div.raise();
        }

        this._boldNode(centerNodeId);

        logo.initCustomLogo(this, 'headai');

        //if (defaultCamera === true) centerMap(this);
        if (showZoomButtons === true) this.addZoomButtons();

        this.centerCamera(centerCameraAround, initialZoom);
        this._refreshComponents();
    }

    #drawBorders() {
        const { container } = this.getComponents();

        const hexagonEdges = HexagonUtils.getEdgeCoordinates(this);
        const sides = Object.keys(hexagonEdges);
        for (var i = 0; i < sides.length; i++) {
            var side = sides[i];
            var filteredConcepts = container.selectAll('svg.concept').datum(d=>d)
            this.#drawBorder(filteredConcepts, hexagonEdges[side], side)
        }
    }

    #drawBorder(concepts, coords, side) {
        const {
            strokeColor, strokeWidth
        } = this.getProperties();

        var x1 = coords['from'][0];
        var y1 = coords['from'][1];
        var x2 = coords['to'][0];
        var y2 = coords['to'][1];

        concepts
            .filter(function (d) { return d.hasOwnProperty(side) && d[side] === true; })
            .append('line')
            .attr('class','wordMapStroke')
            .style('stroke', strokeColor)
            .style('stroke-width', strokeWidth)
            .attr('x1', x1)
            .attr('y1', y1)
            .attr('x2', x2)
            .attr('y2', y2);
    }

    _boldNode(nodeId) {
        if (nodeId == null) return;
        if (this.graphToMap == null) return;
        if (!this.digitalTwin.hasId(nodeId)) return;

        const { categoryField } = this.getProperties();

        const { innerSVG } = this.getComponents();
        const { fontSize, nameField } = this.getProperties();

        const nodeSVG = innerSVG.select(`svg.concept[nodeId="${nodeId}"]`).datum(d=>d);
        nodeSVG.style('opacity', '1');
        
        nodeSVG.selectAll('line').style('opacity', '1');

        const nodeInfo = this.graphToMap.digitalTwin.getNodeInfoById(nodeId);
        const color = this.getColor(nodeInfo[categoryField]);
        const textColor = VisualUtils.invertColor(color);

        const lightest = "#A0A0A0";
        const darkest = "#000000";
        const colorTransition = `${color};${lightest};${color};${darkest};${color}`

        const animate = nodeSVG.select('path').selectAll('animate').data([null]).enter().append('animate')
        animate.attr('attributeName', 'fill')
            .attr('values', colorTransition)
            .attr('repeatCount', 'indefinite')
            .attr('dur', '4s');

        const nodeText = nodeSVG.select('text');
        nodeText.attr('fill', textColor);

        const textObject = nodeSVG.select('text');
        textObject.style('font-weight', 'bold');

        const textContent = nodeInfo[nameField].replace(/_/g, ' ');
        const maxWidth = this.properties.figSize * Math.sqrt(3);
        // maxWidth is multiplied by 0.9 to adjust the text even more. getComputedTextLength function 
        // doesn't consider font-weight to compute the textLength.
        VisualUtils.readjustFontSize(textObject, textContent, fontSize, maxWidth * 0.9);
    }

    _unHighlightNode(nodeId) {
        if (this.graphToMap == null) return;
        const This = this;
        const neighbors = this.digitalTwin.getNeighborsById(nodeId);
        const { innerSVG } = this.getComponents();
        const { centerNodeId } = this.getProperties();
        const allNodes = innerSVG.selectAll('svg.concept').datum(d=>d);

        const { nodes } = this.digitalTwin.getData();
        if (nodes.length == 0) return;

        var maxValue = nodes[0].value;
        var maxValue = this._scaleValue(maxValue);

        allNodes.style('opacity', '1').style('font-weight', 'normal');
        allNodes.selectAll('line').style('opacity', '1');

        const { categoryField } = this.getProperties();

        [nodeId].concat(neighbors).forEach((nodeId) => {
            const nodeInfo = This.digitalTwin.getNodeInfoById(nodeId);
            const nodeSVG = innerSVG.select(`svg.concept[nodeId="${nodeId}"]`).datum(nodeInfo);
            var value = This._scaleValue(nodeInfo['value']);
            var percentBrightness = VisualUtils.scaleBrightness(value, maxValue);
            var color = This.getColor(nodeInfo[categoryField]);
            color = VisualUtils.increaseBrightness(color, percentBrightness);
            nodeSVG.select('path').attr('fill', color);
        });

        this._boldNode(centerNodeId);
    }
}

module.exports = HexagonMap;