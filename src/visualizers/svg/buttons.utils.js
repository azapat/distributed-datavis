const SvgButton = require("./SvgButton");

function addButton(plot, buttonInfo, onClick) {
    if (buttonInfo == null) var buttonInfo = {};
    var buttonInfo = Object.assign({
        x: 0,
        y: 0,
        width: 100,
        height: 30,
        label: 'Button',
        id: null,
        backgroundColor: 'gray'
    }, buttonInfo);

    buttonInfo.onClick = onClick;

    plot._buttons.push(buttonInfo);
    drawButtons(plot);
}

function removeButton(plot,buttonId){
    const indexToRemove = plot._buttons.findIndex(b => b.id === buttonId);
    const buttonInfo = plot._buttons.splice(indexToRemove,1);
    const { outerSVG } = plot.getComponents();
    var button = outerSVG.selectAll('svg.button').data(buttonInfo);
    button.remove();
}

function hideButton(plot,buttonId){
    const buttonInfo = plot._buttons.find(b => b.id === buttonId);
    const { outerSVG } = plot.getComponents();
    var button = outerSVG.selectAll('svg.button').datum(d=>d).filter(d => d === buttonInfo);
    button.style('display','none');
}

function showButton(plot,buttonId){
    const buttonInfo = plot._buttons.find(b => b.id === buttonId);
    const { outerSVG } = plot.getComponents();
    var button = outerSVG.selectAll('svg.button').datum(d=>d).filter(d => d === buttonInfo);
    button.style('display','unset');
}

function drawButton(plot,buttonInfo){
    const button = new SvgButton(buttonInfo);
    const buttonSvg = button.render();
    plot.getComponents().outerSVG.node().appendChild(buttonSvg.node());
}

function drawButtons(plot) {
    const buttons = plot._buttons;
    const { outerSVG } = plot.getComponents();
    var button = outerSVG.selectAll('svg.button')
        .data(buttons).enter()
        .append('svg')
        .attr('class', 'button')
        .attr('width', d => d.width)
        .attr('height', d => d.height)
        .attr('x', d => d.x)
        .attr('y', d => d.y)

    button.append('rect')
        .attr('class', 'buttonBackground')
        .attr('fill', d => d.backgroundColor)
        .attr('width', '100%')
        .attr('height', '100%')
        .on('click', (event, data) => { data.onClick() });

    button.append('text')
        .attr('class', 'buttonText')
        .text(d => d.label)
        .attr('y', '50%')
        .attr('x', '50%')
        .style('text-anchor', 'middle')
        .style('dominant-baseline', 'middle')
        .on('click', (event, data) => { data.onClick() });

    button.style('cursor', 'pointer')
}

const ButtonsUtils = {
    drawButtons,
    drawButton,
    showButton,
    hideButton,
    addButton,
    removeButton,
}

module.exports = ButtonsUtils;