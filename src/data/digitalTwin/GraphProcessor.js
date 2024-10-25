/**
 * @abstract class
 */
class GraphProcessor{
    constructor(mapType){
      if (this.constructor == GraphProcessor) {
        throw new Error("GraphProcessor is an Abstract class, can't be instantiated.");
      }
      this.mapType = mapType;
    }
  
    /** @abstract method */
    getNeighborsCoordinates(center){
      throw new Error("Abstract Method getNeighborsCoordinates(center) has no implementation");
    }
  
    /** @abstract method */
    getSurroundingIds(center,matrix){
      throw new Error("Abstract Method getSurroundingIds(center,matrix) has no implementation");
    }
    
    getValidNeighborsCoordinates(center, matrix){
      var coords = this.getNeighborsCoordinates(center);
      
      var possibleNeighbors = coords.length,
          validCoords = [];
        
      for (var i=0; i < possibleNeighbors; i++){
        var x = coords[i][0],
            y = coords[i][1];
        if (x >= 0 && y >=0 && y < matrix.length && x < matrix[0].length){
          var val = matrix[y][x];
          if (val < 0){
            validCoords.push([x,y]) 
          }
        }
      }
      return validCoords;
    }
}

module.exports = GraphProcessor;