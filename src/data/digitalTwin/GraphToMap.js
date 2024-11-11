const ObjectWithProperties = require("../../properties/ObjectWithProperties");
const { getCenterNode } = require("./DigitalTwinProcessing");
const HexagonGraphProcessor = require("./HexagonGraphProcessor");
const SquareGraphProcessor = require("./SquareGraphProcessor");

class GraphToMap extends ObjectWithProperties {
    static defaultProperties = {
        valueField: 'value',
        nameField: 'label',
        categoryField: 'group',
        centerNode: null,
    }

    digitalTwin = null;

    constructor(digitalTwin, mapType, props = {}) {
        super(props);
        switch (mapType) {
            case 'hexagon':
                this.processor = new HexagonGraphProcessor();
                break;
            case 'square':
                this.processor = new SquareGraphProcessor();
                break;
            default:
                throw new Error('Invalid mapType ' + mapType);
        }

        this.digitalTwin = digitalTwin;

        const { nodes } = this.digitalTwin.getData();

        this.mapType = mapType;

        var { centerNode, nameField } = this.properties;

        if (!this.digitalTwin.hasLabel(centerNode)) {
            this.properties.centerNode = null;
            const centerNodeInfo = getCenterNode(nodes);
            if (centerNodeInfo == null && nodes.length > 0){
                this.properties.centerNode = nodes[0][nameField];
            } else {
                this.properties.centerNode = centerNodeInfo && centerNodeInfo[nameField];
            }
        }
        
        this._locatedNodes = [];
        this._clusters = [];

        this._processNodes(nodes);

        this.locateNodes();
    }

    cleanProcessor() {
        this._locatedNodes = [];
        this._clusters = [];

        const { nodes } = this.digitalTwin.getData();

        this._numberOfPendingNodes = nodes.length;
        for (var i = 0; i < nodes.length; i++) {
            const node = nodes[i];
            node['isPlaced'] = false;
            ['s1', 's2', 's3', 's4', 's5', 's6', 's7', 's8', 'x', 'y'].forEach(attr => delete node[attr]);
        }
    }

    getLocatedNodes() {
        return this._locatedNodes;
    }

    _processNodes(nodes) {
        nodes.forEach(node => {
            if (!node.hasOwnProperty('id')) throw new Error('Node doesn\'t have a well defined id');
            node['isPlaced'] = false;
        })
        this._numberOfPendingNodes = nodes.length;
    }

    setCenterLabel(label) {
        if (typeof (label) != "string") return;
        label = label.trim();
        if (label.length == 0) return;

        if (!this.digitalTwin.hasLabel(label)) return;

        this.setProperties({ 'centerNode': label });
    }

    locateNodes() {
        const { nameField } = this.getProperties();
        this.cleanProcessor();

        this._singles = [];

        const { nodes } = this.digitalTwin.getData();

        if (nodes.length == 0) return;

        // Defines default center if none is set
        var { centerNode } = this.getProperties();
        if (centerNode == null || !this.digitalTwin.hasLabel(centerNode)) this.setCenterLabel(nodes[0][nameField]);

        // Locate Center First
        var { centerNode } = this.getProperties();

        var node = this.digitalTwin.getNodeInfoByLabel(centerNode);
        var nodesBeingLocated = this._locateNode(node);
        this.placeNodes(nodesBeingLocated);

        for (var i = 0; i < nodes.length; i++) {
            var node = nodes[i];
            if (node['isPlaced'] === true) continue;
            var nodesBeingLocated = this._locateNode(node);
            this.placeNodes(nodesBeingLocated);
        }
        var nodesBeingLocated = this._locateSingles();
        this.placeNodes(nodesBeingLocated, true);
        this._generateBorders();
    }

    locateNodesAround(nodeId) {
        const { nameField } = this.getProperties();
        this.cleanProcessor();
        const centralNode = this.digitalTwin.getNodeInfoById(nodeId);
        if (centralNode != null) this.setCenterLabel(centralNode[nameField]);
        var nodesBeingLocated = this._locateNode(centralNode);
        this.placeNodes(nodesBeingLocated);
        this.locateNodes();
    }

    placeNodes(nodesBeingLocated, forceVerticalStack = false) {
        if (nodesBeingLocated.length === 0) return;  // Node without surrounding children is located along with other singles
        var A = this._buildMatrixFromNodes(this._locatedNodes);
        var B = this._buildMatrixFromNodes(nodesBeingLocated);

        this._clusters.push(nodesBeingLocated);

        const A_rows = A.length;
        if (A_rows !== 0) {
            const A_cols = A[0].length;

            if (A_rows < A_cols || forceVerticalStack === true) {
                var { xPad, yPad } = this._getMaxVerticalOverlap(A, B);
                yPad += 2;
                if (forceVerticalStack === true) yPad += 2;
            } else {
                var xPad = A_cols + 2;
                var yPad = 0;
            }
            this._padNodes(nodesBeingLocated, xPad, yPad);
        }
        this._locatedNodes = this._locatedNodes.concat(nodesBeingLocated);
    }

    _locateNode(node) {
        if (node == null) console.log('WARNING: LocateNode() received a null node');
        const neighbors = this.digitalTwin.getNeighborsByLabel(node.label);
        const numberOfNeighbors = neighbors.filter(id => this.digitalTwin.getNodeInfoById(id)['isPlaced'] === false).length;
        if (numberOfNeighbors === 0) {
            this._singles.push(node);
            return [];
        }

        const c = Math.ceil(this._numberOfPendingNodes / 2);
        const cx = c;
        const cy = c;
        const { id } = node;

        node.x = cx;
        node.y = cy;
        node.isPlaced = true;
        this._numberOfPendingNodes--;

        var nodesBeingLocated = [node];

        // Creates Matrix and locates Node in the center
        var rows = cy * 2 + 1,
            cols = cx * 2 + 1,
            matrix = Array(rows).fill(null).map(() => Array(cols).fill(-1));
        matrix[cy][cx] = id;

        this._locateChildren([node], nodesBeingLocated, matrix);
        this._centerNodes(nodesBeingLocated);
        return nodesBeingLocated;
    }

    _locateChildren(nodes, nodesBeingLocated, matrix) {
        var nodesForNextIteration = [];
        nodes.forEach(node => {
            const { id } = node;
            const children = this.digitalTwin.getNeighborsById(id).filter(id => this.digitalTwin.getNodeInfoById(id)['isPlaced'] === false);
            const center = [node.x, node.y];
            const validCoordinates = this.processor.getValidNeighborsCoordinates(center, matrix);
            const nChildrensToPlace = Math.min(children.length, validCoordinates.length);
            for (var i = 0; i < nChildrensToPlace; i++) {
                const x = validCoordinates[i][0];
                const y = validCoordinates[i][1];
                const childId = children[i];
                const child = this.digitalTwin.getNodeInfoById(childId);
                child.x = x;
                child.y = y;
                child['isPlaced'] = true;
                nodesBeingLocated.push(child);
                matrix[y][x] = childId;
                nodesForNextIteration.push(child);
            }
        });

        if (nodesForNextIteration.length > 0) {
            this._locateChildren(nodesForNextIteration, nodesBeingLocated, matrix);
        }
    }

    _matricesAreOverlapping(A, B, bx, by, emptyValue = -1) {
        const A_rows = A.length;
        if (A_rows == 0) return false;
        if (by >= A_rows) return false;
        const A_cols = A[0].length;
        if (A_cols == 0) return false;
        if (bx >= A_cols) return false;
        const B_rows = B.length;
        if (B_rows == 0) return false;
        const B_cols = B[0].length;
        if (B_cols == 0) return false;

        const x0 = bx;
        const x1 = Math.min(A_cols, bx + B_cols);
        const y0 = by;
        const y1 = Math.min(A_rows, by + B_rows);

        var B_x = 0;
        for (var A_x = x0; A_x < x1; A_x++) {
            var B_y = 0;
            for (var A_y = y0; A_y < y1; A_y++) {
                var A_i = A[A_y][A_x];
                var B_i = B[B_y][B_x];
                //console.log(`A[${A_y}][${A_x}] = ${A_i}`)
                //console.log(`B[${B_y}][${B_x}] = ${B_i}`)
                if (A_i != emptyValue && B_i != emptyValue) return true;
                B_y++;
            }
            B_x++;
        }
        return false;
    }

    _getMaxVerticalOverlapAux(A, B, x_i) {
        const A_rows = A.length;
        var xPad = x_i;
        var yPad = A_rows;
        var y0 = A_rows - 1;
        var decrease = 1;
        if (this.mapType === 'hexagon') {
            if (y0 % 2 != 0) y0--;
            decrease = 2;
        }
        for (var y_i = y0; y_i >= 0; y_i -= decrease) {
            if (this._matricesAreOverlapping(A, B, x_i, y_i)) break;
            yPad = y_i;
        }
        return { xPad, yPad };
    }

    _getMaxVerticalOverlap(A, B) {
        const A_rows = A.length;
        if (A_rows == 0) throw new Error('A matrix is empty');
        const A_cols = A[0].length;
        var xPadMin = 0;
        var yPadMin = A_rows;
        for (var x_i = 0; x_i < A_cols; x_i++) {
            const { xPad, yPad } = this._getMaxVerticalOverlapAux(A, B, x_i);
            if (yPad < yPadMin) {
                yPadMin = yPad;
                xPadMin = xPad;
            }

        }
        return { xPad: xPadMin, yPad: yPadMin };
    }

    _centerNodes(nodes) {
        var dx = 0, dy = 0;
        if (this.mapType == "square") {
            dx = Math.min.apply(Math, nodes.map(function (o) { return o.x; }))
            dy = Math.min.apply(Math, nodes.map(function (o) { return o.y; }))
        } else if (this.mapType == "hexagon") {
            dx = Math.min.apply(Math, nodes.map(function (o) { return o.x; }))
            dy = Math.min.apply(Math, nodes.map(function (o) { return o.y; }))
            if (dy % 2 != 0) {
                dy = dy - 1;
            }
        }
        return nodes.forEach(function (node) { node.y -= dy; node.x -= dx; });
    }

    _buildMatrixFromNodes(nodes) {
        if (nodes.length === 0) return [];
        var cols = Math.max.apply(null, nodes.map(function (node) { return node.x; })) + 1;
        var rows = Math.max.apply(null, nodes.map(function (node) { return node.y; })) + 1;
        var matrix = Array(rows).fill(null).map(() => Array(cols).fill(-1));
        for (var i = 0; i < nodes.length; i++) {
            var node = nodes[i],
                x = node.x,
                y = node.y,
                id = node.id;
            matrix[y][x] = id;
        }
        return matrix;
    }

    _generateBorders() {
        const nodes = this._locatedNodes;
        const matrix = this._buildMatrixFromNodes(nodes);
        for (var i = 0; i < nodes.length; i++) {
            var currentNode = nodes[i]
            var { x, y, id } = currentNode;
            var surrounding = this.processor.getSurroundingIds([x, y], matrix)
            var surroundingLabels = Object.keys(surrounding);
            var neighbors = this.digitalTwin.getNeighborsById(id);
            for (var j = 0; j < surroundingLabels.length; j++) {
                var side = surroundingLabels[j]
                var value = surrounding[side]
                if (!neighbors.includes(value)) {
                    currentNode[side] = true;
                }
            }
        }
    }

    _locateSinglesSquare(singles, maxCols) {
        const nSingles = singles.length;
        var x = 0;
        var y = 0;
        for (var i = 0; i < nSingles; i++) {
            var node = singles[i];
            node.x = x;
            node.y = y;
            x += 2;
            if (x > maxCols) {
                y += 2;
                x = 0;
            }
        }
        return singles;
    }

    _locateSinglesHexagon(singles, maxCols) {
        const nSingles = singles.length;
        var x = 0;
        var y = 0;
        for (var i = 0; i < nSingles; i++) {
            var node = singles[i];
            node.x = x;
            node.y = y;
            x += 3;
            if (x > maxCols) {
                y++;
                x = (y % 2 === 0) ? 0 : 1;
            }
        }
        return singles;
    }

    _locateSingles() {
        const singles = this._singles;
        const maxCols = Math.ceil(Math.sqrt(singles.length));
        if (this.mapType == 'hexagon') return this._locateSinglesHexagon(singles, maxCols);
        if (this.mapType == 'square') return this._locateSinglesSquare(singles, maxCols)
    }

    _padNodes(nodes, xPad, yPad) {
        return nodes.forEach(function (node) { node.x += xPad; node.y += yPad; });
    }
}

module.exports = GraphToMap;