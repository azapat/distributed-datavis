const SvgVisualization = require("../svg/SvgVisualization");
const VisualUtils = require("../visual.utils");

class AxisVisualization extends SvgVisualization {

    static defaultProperties = {
        axisMargin: {top:0,left:0,right:0,bottom:0}
    }

    static rulesProperties = {
        axisMargin : { type : 'Dictionary' , subtype : 'number' }
    }

    constructor(props = {}) {
        super(props);
    }

    addAxis(axis, position) {
        const { axisMargin, margin } = this.getProperties();
        const { innerHeight } = this.calculateInnerSize();

        const { innerSVG } = this.getComponents();
        switch (position) {
            case 'bottom':
                var x = 0;
                var y = innerHeight - axisMargin.bottom - axisMargin.top;
                var gAxis = innerSVG.selectAll('g.axisBottom').data([null]).enter()
                    .append('g')
                    .attr('class', 'axisBottom')
                    .attr('transform', `translate(${x},${y})`)
                    .call(axis);
                var axisText = gAxis.selectAll('text')
                this._setTextProperties(axisText);
                break;
            case 'left':
                var x = axisMargin.left;
                var y = 0;
                var gAxis = innerSVG.selectAll('g.axisLeft').data([null]).enter()
                    .append('g')
                    .attr('class', 'axisLeft')
                    .attr('transform', `translate(${x},${y})`)
                    .call(axis);
                var axisText = gAxis.selectAll('text')
                this._setTextProperties(axisText);
                break;
            case 'right':
            case 'top':
                console.log(`Error executing addAxis(axis,position) Position ${position} not implemented yet`);
                return;
            default:
                console.log('Error executing addAxis(axis,position) Supported Positions: [bottom, left]');
                return;
        }

        return gAxis;
    }

    wrapAxis(position, length) {
        const { outerSVG } = this.getComponents();
        var axisId = '';
        switch (position) {
            case 'left':
                axisId = 'axisLeft';
                break;
            case 'bottom':
                axisId = 'axisBottom';
                break;
            default:
                console.log('Error executing addAxis(axis,position) Supported Positions: [bottom, left]');
                break;
        }
        const gAxis = outerSVG.selectAll(`g.${axisId}`);
        const axisText = gAxis.selectAll('text');
        axisText.call(VisualUtils.wrapLines, length);
    }
}

module.exports = AxisVisualization;