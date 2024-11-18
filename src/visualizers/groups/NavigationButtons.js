const { SvgComponent } = require("../svg");

class NavigationButtons extends SvgComponent{
    static defaultProperties = {
        buttonSize: 40,
        height: 80,
        width: 800,
        buttonMargin: 10,
        inactiveColor: "#08233B",
        activeColor: "#11A1F3",
        activeIndex: -1,
        onClick: ()=>{}
    }

    static rulesProperties = {
        activeIndex: { type : 'number' },
    }

    constructor(data,props){
        super(data,props);
    }

    clean(){
        const { container } = this.components;
        container.selectAll('*').remove();
    }

    /**
     * 
     * @param {Array<String>} data  Array of buttonTitles
     */
    draw(buttonTitles){
        super.draw(buttonTitles);
        this.clean();
        const buttonsData = [];

        const { width , buttonSize , buttonMargin } = this.properties;
        const { container } = this.components;

        const nButtons = buttonTitles.length;
        for (var i=0; i< nButtons; i++){
            const title = buttonTitles[i];
            const sectionSize = (width / nButtons);
            const x = sectionSize*(i+1) - sectionSize/2;
            const buttonData = { "index": i, "x": x, "title": title };
            buttonsData.push(buttonData);
        }

        const linesData = [];

        for (var i=1; i< nButtons; i++){
            const sectionSize = (width / nButtons)
            const x1 = sectionSize*(i) - sectionSize/2;
            const x2 = sectionSize*(i+1) - sectionSize/2;
            const data = { "x1": x1, "x2": x2 };
            linesData.push(data);
        }
        
        const thisPlot = this;

        const r = buttonSize / 2;
        const yPos = r + buttonMargin;

        const buttonsSVG = container;

        buttonsSVG.selectAll('line').data(linesData).enter()
        .append('line')
        .attr('x1', d => d.x1)
        .attr('x2', d => d.x2)
        .attr('y1', yPos)
        .attr('y2', yPos)
        .attr('stroke','gray')
        .attr('stroke-dasharray',7);

        buttonsSVG.selectAll('circle').data(buttonsData).enter()
        .append('circle')
        .attr('r', r)
        .attr('cy', yPos)
        .attr('cx', d => d.x)
        .attr('index', d => d.index)
        .style('cursor','pointer')
        .on('click', (action,data)=>{
            const index = data.index;
            this.properties.onClick(index);
        });

        const BUTTON_TITLE_WIDTH = 150;
        const BUTTON_TITLE_HEIGHT = 30;

        const titles = buttonsSVG.selectAll('svg.buttonTitle').data(buttonsData).enter()
        .append('svg')
        .attr('class','buttonTitle')
        .attr('width', BUTTON_TITLE_WIDTH)
        .attr('height', BUTTON_TITLE_HEIGHT)
        .attr('x', d => d.x - BUTTON_TITLE_WIDTH/2)
        .attr('y', d => yPos + r);
        
        titles.append('text')
        .attr('y','50%')
        .attr('x','50%')
        .attr('dominant-baseline','middle')
        .attr('text-anchor','middle')
        .text( d => d.title);
        
        buttonsSVG.selectAll('svg.text').data(buttonsData)
        this._refreshComponents();
    }

    _refreshComponents(){
        super._refreshComponents();
        const { container } = this.getComponents();
        const { inactiveColor , activeColor } = this.properties;
        const buttons = container.selectAll('circle');

        buttons.attr('fill', inactiveColor)
        .attr('stroke-width',3)
        .attr('stroke',null);

        const { activeIndex } = this.properties;

        if (activeIndex < 0) return;

        const button = container.selectAll(`circle[index='${activeIndex}']`);
        button.attr('fill', activeColor)
        .attr('stroke', inactiveColor);
    }
}

module.exports = NavigationButtons;