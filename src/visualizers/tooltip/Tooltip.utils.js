const Tooltip = require("./Tooltip");

function enableTooltip(plot, enable) {
    enable = enable === true;
    const oldValue = plot.properties.enableTooltip;
    if (oldValue === enable) return;
    plot.properties.enableTooltip = enable;
    if (enable) {
        createTooltip(plot);
    } else {
        plot.tooltip.cleanSVG();
        plot.tooltip.getComponents().div.remove();
        plot.tooltip = null;
    }
}

function createTooltip(plot) {
    const { container } = plot.getComponents();
    const tooltipId = plot.plotId + '_tooltip';
    container.selectAll('svg#' + tooltipId).data([null]).enter()
        .append('svg')
        .attr('class', 'tooltip')
        .attr('id', tooltipId);

    const {
        fontFamily, fontSize
    } = plot.getProperties();

    const tooltipProps = {
        fontSize: fontSize,
        fontFamily: fontFamily,
        width: 300,
        height: 50,
        margin: { top:10 , left:10 , right:10 , bottom:10 }
    }

    if (plot.tooltip == null) {
        plot.tooltip = new Tooltip(tooltipId, tooltipProps);
        container.append(()=>plot.tooltip.components.mainContainer.node());
    } else {
        plot.tooltip.restartSVG();
    }

    plot.tooltip.hide();
}

const TooltipUtils = {
    enableTooltip,
    createTooltip,
}

module.exports = TooltipUtils;