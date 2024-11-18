const Component = require("../Component");

class SvgComponent extends Component {
    static defaultProperties = {
        containerTag: 'svg',
        innerMargin: {top:0, right:0, bottom:0, left:0},
    };

    static rulesProperties = {
        innerMargin: { type: 'dictionary' , subtype: 'number' },
    };


    initComponents(){
        super.initComponents();

        const { mainContainer } = this.components;
        const { margin, width, height, fontFamily, backgroundColor } = this.properties;

        const TITLE_FONT_SIZE = '24px';
        const TITLE_HEIGHT = '30px';

        const titleSVG = mainContainer.selectAll("svg#titleSVG")
            .data([null]).enter()
            .append("svg")
            .attr("id", "titleSVG")
            .style('width', width)
            .style('height', TITLE_HEIGHT)
            .style('display', 'none');

        titleSVG.selectAll('text').data([null]).enter()
            .append('text')
            .attr('y', TITLE_FONT_SIZE)
            .attr('x', '50%')
            .style('font-family', fontFamily)
            .style('font-size', TITLE_FONT_SIZE)
            .style('text-anchor', 'middle')
            .style('text-transform', 'capitalize');

        const expansorSVG = mainContainer.selectAll('svg.expansor').data([null]).enter().append('svg').attr('class', 'expansor');
        expansorSVG.style('width', '100%').style('height', '0px');

        const outerSVG = mainContainer.classed('outerSVG', true);

        const innerSVG = outerSVG.selectAll('svg.innerSVG')
            .data([null])
            .enter()
            .append('svg')
            .attr('class', 'innerSVG');

        const background = innerSVG.selectAll('rect.background')
            .data([null])
            .enter()
            .append('rect')
            .attr('class', 'background')
            .attr('fill', backgroundColor)
            .attr('width', '100%').attr('height', '100%');

        var container = innerSVG.selectAll('g.container').data([null]).enter().append('g').attr('class', 'container');

        this.components = { ...this.components , titleSVG, expansorSVG, outerSVG, innerSVG, background, container };
    }

    calculateInnerSize() {
        var { innerMargin, width, height } = this.getProperties();
        const innerWidth = width - innerMargin.left - innerMargin.right;
        const innerHeight = height - innerMargin.top - innerMargin.bottom;
        return { innerWidth , innerHeight };
    }
}

module.exports = SvgComponent;