const GraphProcessor = require("./GraphProcessor");

class SquareGraphProcessor extends GraphProcessor{
    constructor(){
      super('square');
      this.adjacentCoordinatesOrder = ['s2','s3','s4','s1','s7','s6','s8','s5'];
    }
  
    getNeighborsCoordinates(center){
      const x = center[0];
      const y = center[1];
      const neighborCoordinates = [];
    
      const coordinates = {
        s1: [x,y-1],
        s2: [x+1,y],
        s3: [x,y+1],
        s4: [x-1,y],
        s5: [x-1,y-1],
        s6: [x+1,y-1],
        s7: [x+1,y+1],
        s8: [x-1,y+1]
      }
      
      for (var i=0; i < this.adjacentCoordinatesOrder.length; i++){
        const side = this.adjacentCoordinatesOrder[i];
        const coordinate = coordinates[side];
        neighborCoordinates.push(coordinate);
      }
  
      return neighborCoordinates;
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
}

module.exports = SquareGraphProcessor;
