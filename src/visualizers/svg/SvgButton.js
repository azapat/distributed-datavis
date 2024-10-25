const SvgComponent = require("./SvgComponent");

class SvgButton extends SvgComponent {
    static defaultProperties = {
        fontSize: 10,
        fontFamily: 'arial',
        showDetails: true,
        margin: {top:0 , bottom: 0 , left: 0 , right : 0},
        width: 100,
        height: 100,
        backgroundColor: '#F0F0F0'
    }

    draw(data){
        super.draw(data);
        const svg = this.getComponents().mainContainer;
        const { width, height, backgroundColor } = this.properties;

        svg.attr('width',width).attr('height',height)
        .attr('x',0).attr('y',0);

        svg.append('rect')
        .attr('width','100%')
        .attr('height','100%')
        .attr('fill',backgroundColor)
        .on('click',()=>{console.log('Button has been clicked')});

        svg.append('text')
        .text('EXAMPLE BUTTON')
        .attr('x','50%')
        .attr('y','50%');

    }
}

module.exports = SvgButton;