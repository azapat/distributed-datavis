const GraphProcessor = require("./GraphProcessor");

class HexagonGraphProcessor extends GraphProcessor{
    constructor(){
      super('hexagon');
      this.adjacentCoordinatesOrder = ['s3','s6','s5','s4','s1','s2'];
    }
  
    getSurroundingIds(center,matrix){
      var ids = {};
      var coords = this.getNeighborsCoordinates(center)
      var sidesOrder = this.adjacentCoordinatesOrder;
    
      for (var i=0; i<coords.length; i++){
        var c = coords[i],    // c = [cx,cy]
            x = c[0],
            y = c[1];
    
        if (x >= 0 && y >=0 && y < matrix.length && x < matrix[0].length){
          var id = matrix[y][x];
          if (id != -1){
            var label = sidesOrder[i]
            ids[label] = id;    // E.j. ids['s1'] == ID
          }
        }
      }
      return ids;
    }
  
    getNeighborsCoordinates(center){
      var cx = center[0],
          cy = center[1],
          adjacentCoords = [],
          coords = {};
    
      if(cy % 2 == 0){
        coords['s1'] = [cx-1,cy-1];
        coords['s2'] = [cx,cy-1];
        coords['s3'] = [cx+1,cy];
        coords['s4'] = [cx,cy+1];
        coords['s5'] = [cx-1,cy+1];
        coords['s6'] = [cx-1,cy];
      } else {
        coords['s1'] = [cx,cy-1];
        coords['s2'] = [cx+1,cy-1];
        coords['s3'] = [cx+1,cy];
        coords['s4'] = [cx+1,cy+1];
        coords['s5'] = [cx,cy+1];
        coords['s6'] = [cx-1,cy];
      }
    
      for (var i=0; i< this.adjacentCoordinatesOrder.length; i++){
        var side = this.adjacentCoordinatesOrder[i],
            coor = coords[side]
        adjacentCoords.push(coor)
      }
    
      return adjacentCoords
    }
}

module.exports = HexagonGraphProcessor;