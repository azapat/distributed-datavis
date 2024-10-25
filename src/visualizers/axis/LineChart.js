const AxisVisualization = require("./AxisVisualization");

class LineChart extends AxisVisualization{
    static defaultProperties = {
        strokeWidth: 3.5,          // Width of the Lines
        confidenceOpacity: 0.3,    // Opacity of the confidence areas
        boxOpacity: 0.7,           // Opacity of the InfoBox of each point
        boxSize: [80,40],          // [width, height] of the InfoBox
        lineOpacity: 0.9,
        valuesField: 'demand',
        errorField: 'error_factor',
        detailBoxParent: 'body',
        width: 700,
        height: 500,
        axisMargin: {top: 30, right: 30, bottom: 20, left: 60}
    }
    
    setBoxSize(width, height){
      if (width >= 0 && height >= 0){
        this._boxSize = [width, height];
        this._detailBox.style('height',height)
        .style('width',width)
      }
    }
    
    _hideCircles(){
      const { container } = this.getComponents();
      var circles = container.selectAll('circle.tipcircle');
      circles.style('opacity',0);
    }
  
    _restoreSeries(){
        const { 
            strokeWidth, lineOpacity, confidenceOpacity 
        } = this.getProperties();

        const { outerSVG , container } = this.getComponents();

        outerSVG.selectAll('g[id=legend]').style('opacity',1);
        container.selectAll('path[id=line]')
            .style('stroke-width', strokeWidth + 'px')
            .style('opacity', lineOpacity)
        container.selectAll('path[id=confidence]')
            .style('opacity', confidenceOpacity);
    }
  
    _highlightSeries(concept){
        const {
            strokeWidth, 
        } = this.getProperties();

        const { outerSVG , container } = this.getComponents();

        container.selectAll('path#line')
            .style('stroke-width',function(){return (this.getAttribute('concept') === concept)? '6px': strokeWidth})
            .style('opacity',function(){return (this.getAttribute('concept') === concept)? 1: 0.1})
        container.selectAll('path[id=confidence]')
            .style('opacity',function(a){return (this.getAttribute('concept') === concept)? 0.5: 0.05});
        outerSVG.selectAll('g[id=legend]')
            .style('opacity',function(a){return (this.getAttribute('concept') === concept)? 1: 0.05});
    }
  
    _highlightCircles(concept){
      const { container } = this.getComponents();
      var circles = container.selectAll('circle.tipcircle');
      circles.filter(function(){return this.getAttribute('concept') == concept}).style('opacity',0.6);
    }
  
    /**
     *  size = [width, height]
     */
    draw(data,labels=null, title=null){
        this.restartSVG();
        super.draw(data);
    
        if (data == null || !Array.isArray(data) || data.length == 0){
            this.showMessage('Error at SimpleLineChart.plot() : input data is invalid');
            return;
        }
    
        if (data.length == 0){
            this.showMessage('Empty data');
            return;
        }
        
        this.properties.labels = labels;
    
        if (labels == null || !Array.isArray(labels) || labels.length < data.length){
            console.log(`Warning at SimpleLineChart.plot() : ignoring labels ${labels} -> invalid format`);
            labels = []
            for (var i=0; i < data.length; i++){
            labels.push(i);
            }
        }
    
        this._plotData = data;
    
        const {
            width, height, margin, axisMargin,
            nameField, lineOpacity, strokeWidth, confidenceOpacity,
        } = this.properties;

        const { innerWidth , innerHeight } = this.calculateInnerSize();
    
        var detailBox = this._detailBox;
        
        const { container } = this.getComponents();
    
        // Initialization of Domain and Range in X and Y
        var xDomain = labels.slice(0,data.length);
        var xRange = []
        var xMin = axisMargin.left;
        var xMax = innerWidth - axisMargin.right - xMin;
        for (var i=0; i < xDomain.length; i++){
            var xPos = xMax / (xDomain.length - 1) * i;
            xPos += xMin;
            xRange.push(xPos);
        }
    
        var yDomain = [Math.min.apply(null,data), Math.max.apply(null,data)];
        var yMin = axisMargin.top + margin.top;
        var yMax = innerHeight - axisMargin.bottom - yMin;
        var yRange = [yMax, yMin];
        // End
    
        var x = d3.scaleOrdinal()
            .domain(xDomain)
            .range(xRange);
    
        var y = d3.scaleLinear()
            .domain(yDomain)
            .range(yRange);
  
        container.append('path')
            .datum(data)
            .attr('fill', 'none')
            .attr('id','line')
            .attr('stroke', 'black')
            .attr('d', d3.line()
                .x( (d,i) => x(labels[i]) )
                .y( (d) =>  y(d) )
            )
            .attr('stroke-width', strokeWidth + 'px')
            .attr('opacity', lineOpacity);
  
        container.selectAll('circle')
            .data(data).enter()
            .append('circle')
            .attr('value',function(d){return d.value})
            .attr('class','tipcircle')
            .attr('cx', function(d,i){return x(labels[i]) })
            .attr('cy',function(d){return y(d)})
            .attr('r',8)
            .style('opacity', 1)
            .style('fill',"black");
    
        var yAxis = d3.axisLeft(y).ticks(5);
    
        var xAxis = d3.axisBottom()
        //.tickFormat(d3.format('.0f')) // Removed for cases where labels are not numbers
        .scale(x);
            
        this.addAxis(yAxis, 'left');
    
        this.addAxis(xAxis,'bottom');
    }
}

module.exports = LineChart;