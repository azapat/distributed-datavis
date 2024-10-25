const GraphToMap = require("./GraphToMap");

/**
 * WideGraphToMap is an implementation of GraphToMap. It has a different algorithm to place the nodes in the space.
 * This implementation gives more priority to the relations between nodes, for that reason, any pair of nodes that are
 * placed next to each other HAS to be related (the edge that conects both concepts must exist).
 * 
 * In other words, using this algorithm, there are no divisions between hexagons because they must be related in order
 * to be placed contiguously.
 */
class WideGraphToMap extends GraphToMap {
    constructor(digitalTwin,mapType,props={}){
        super(digitalTwin,mapType,props);
    }

    canPlaceNode(node, x, y, matrix){
        const nodeId = node.id;
        const neighbors = this.digitalTwin.getNeighborsById(nodeId);
        const location = [x,y];
        const validCoordinates = this.processor.getNeighborsCoordinates(location, matrix);
        for (var i=0; i < validCoordinates.length; i++){
            const coords = validCoordinates[i];
            const cx = coords[0];
            const cy = coords[1];
            if (cx < 0 || cy < 0) continue;
            if (cy >= matrix.length) continue;
            if (matrix.length > 0 && cx >= matrix[0].length) continue;
            const id = matrix[cy][cx];
            if (id == -1) continue;
            // If can't find the id in the list of neighbors, the new node can't be placed in that position
            if (!neighbors.includes(id)) return false;
        }

        return true;
    }

    _locateChildren(nodes, nodesBeingLocated, matrix){
        var nodesForNextIteration = [];
        nodes.forEach(node => {
          const nodeId = node.id;
          var children = this.digitalTwin.getNeighborsById(nodeId).filter((id) => this.digitalTwin.getNodeInfoById(id)['isPlaced'] === false);
          const center = [node.x,node.y];
          const validCoordinates = this.processor.getValidNeighborsCoordinates(center, matrix);
          const nChildrensToPlace = Math.min(children.length , validCoordinates.length);
          for (var i=0; i < nChildrensToPlace; i++){
            const x = validCoordinates[i][0];
            const y = validCoordinates[i][1];
            var selectedChild = null;
            for (var j=0; j < children.length; j++){
                const childId = children[j];
                const child = this.digitalTwin.getNodeInfoById(childId);
                if (!this.canPlaceNode(child, x, y, matrix)) continue;
                // Place node and stop searching candidates for that space
                selectedChild = child;
                break;
            }

            if (selectedChild == null) return;
            const child = selectedChild;

            const childId = child.id;
            child.x = x;
            child.y = y;

            child['isPlaced'] = true;
            nodesBeingLocated.push(child);
            //children.pop(child);
            children = this.digitalTwin.getNeighborsById(nodeId).filter(id => this.digitalTwin.getNodeInfoById(id)['isPlaced'] === false);

            matrix[y][x] = childId;
            nodesForNextIteration.push(child);
          }
        });
    
        if (nodesForNextIteration.length > 0){
          this._locateChildren(nodesForNextIteration, nodesBeingLocated, matrix);
        }
    }

    /**
     * Verifies if putting matrix B over matrix A at position (bx,by) generates an overlapping of the values
     * or if both can be merged at the specified position. In other words, if values of matrix B can be placed
     * in empty spaces of matrix A. This also checks if the nodes of B are not contiguous to unrelated nodes of A
     * (edge between any contiguous pair of nodes must exist)
     * @param {*} A Matrix that is taken as the base of the overlapping
     * @param {*} B Matrix that is placed over matrix A at position (bx,by)
     * @param {*} bx 
     * @param {*} by 
     * @param {*} emptyValue By default, emptyValue is represented with a -1 in the matrix.
     * @returns 
     */
    _matricesAreOverlapping(A,B,bx,by, emptyValue=-1){
        const { nodes } = this.digitalTwin.getData();

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
        for (var A_x=x0; A_x<x1; A_x++){
          var B_y = 0;
          for (var A_y=y0; A_y<y1; A_y++){
            var A_i = A[A_y][A_x];
            var B_i = B[B_y][B_x];
            if (A_i != emptyValue && B_i != emptyValue) return true;
            B_y++;
          }
          B_x++;
        }

        // Generate Temporal overlap matrix
        const overlapMatrix = this.generateOverlapMatrix(A,B,bx,by);
        if (this.matrixHasDivisions(overlapMatrix)) return true;

        return false;
    }

    /**
     * Generates the Matrix of the intersection area of B over A at position (bx,by).
     * Empty value is represented as -1. If both A and B have a value different than -1, value B is taken.
     * The overlap matrix has a padding of 1, which means that the generated matrix shows 1 column before the overlapping,
     *   1 column after the overlapping, 1 row before and 1 row after the overlapping, if the overlapping area allows it.
     * 
     * This function only return the intersection area (overlapping area) plus extra rows and columns determined by the padding.
     * 
     * @param {Matrix} A Matrix that will be taken as the base of the overlapping
     * @param {Matrix} B Matrix that will be placed over Matrix A
     * @param {Int} bx Initial Position in x that matrix B will have over matrix B
     * @param {Int} by Initial Position in y that matrix B will have over matrix A
     * @returns 
     */
    generateOverlapMatrix(A,B,bx,by){
        // Padding is used to look n rows and n columns before the overlapping
        const padding = 1
        const A_rows = A.length;
        if (A_rows == 0) return null;
        if (by >= A_rows) return null;
        const A_cols = A[0].length;
        if (A_cols == 0) return null;
        if (bx >= A_cols) return null;
        const B_rows = B.length;
        if (B_rows == 0) return null;
        const B_cols = B[0].length;
        if (B_cols == 0) return null;

        const x0 = Math.max(bx - padding,0);
        const x1 = Math.min(A_cols, bx + B_cols + padding);
        const y0 = Math.max(by - padding, 0);
        const y1 = Math.min(A_rows, by + B_rows + padding);

        const cols = x1 - x0;
        const rows = y1 - y0;

        const newMatrix = Array(rows).fill(null).map(() => Array(cols).fill(-1));

        // Get Submatrix of A in that Space
        for (var y=0; y < rows; y++){
            for (var x=0; x < cols; x++){
                const Ax = x0 + x;
                const Ay = y0 + y;
                var value = A[Ay][Ax];
                newMatrix[y][x] = value;
            }
        }

        // Override vallues of B over A
        for(var y=0; y < B_rows; y++){
            for(var x=0; x < B_cols; x++){
                const Ax = padding + x;
                const Ay = padding + y;
                var value = B[y][x];
                if (value == -1) continue;
                if (Ay >= rows) continue;
                if (Ax >= cols) continue;
                newMatrix[Ay][Ax] = value;
            }
        }
        return newMatrix;
    }

    matrixHasDivisions(matrix){
        if (matrix == null) return false;
        for (var y = 0; y < matrix.length; y++){
            for (var x = 0; x < matrix[0].length; x++){
                const id = matrix[y][x];
                if (id == -1) continue;
                const node = this.digitalTwin.getNodeInfoById(id);
                if (!this.canPlaceNode(node, x, y, matrix)) return true;
            }
        }
        return false;
    }
}

module.exports = WideGraphToMap;