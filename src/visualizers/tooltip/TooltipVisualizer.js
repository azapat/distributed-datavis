import { LineChart } from "../axis";
import SvgVisualization from "../svg/SvgVisualization";

export class TooltipVisualizer extends SvgVisualization {
    static _showTooltipChart(plot) {
        const tooltip = plot.tooltipChart;
        if (plot.tooltipChart == null) return;
        plot.tooltipChart.show();
        const { innerSVG } = plot.getComponents();
        innerSVG.style('opacity', 0.2);
        const tooltipSVG = tooltip.getComponents().outerSVG;
        tooltipSVG.style('opacity', 1);
    }

    static _hideTooltipChart(plot) {
        if (plot.tooltipChart == null) return;
        plot.tooltipChart.hide();
        const { innerSVG } = plot.getComponents();
        innerSVG.style('opacity', 1)
    }

    static showEmbeddedVisualization(plot, json, plotType, uniqueName = null) {
        const plotId = plot.plotId;
        var subPlot = null;
        var plotType = plotType.toLowerCase();
        var props = plot.getProperties();
        props['uniqueName'] = uniqueName;

        // Inherit properties has been disabled
        // These props must be added ONLY if the type of the parent and the child visualization is the same
        /** 
        var filteredProps = {
          margin : props.margin,
          nameField : props.nameField,
          valueField: props.valueField,
        }
        */

        // Removing the filtered Props
        delete props.nameField
        delete props.valueField
        delete props.margin

        // Removing props that must not be taken into account
        delete props.enableAutoResize
        delete props.enableTooltip
        delete props.enableZoom
        delete props.hideNumber

        // Set custom properties
        props = mergeDictionaries(props, plot._subPlotProperties);

        // Build plot depending on the plotType
        switch (plotType) {
            case 'linechart':
                var subPlot = LineChart(plotId, props);
                subPlot.plot(json);
                break;
            case 'hexagon':
            case 'square':
            case 'topbarchart':
            case 'barchart':
            case 'basicbarchart':
            case 'barchartgroup':
            case 'linechart':
            case 'top20':
            case 'barchart':
            default:
                console.log("ShowEmbeddedVisualization is not implemented for plotType = " + plotType)
                return;
        }

        if (subPlot == null) return;

        // Inherit properties has been disabled
        // Setup margin as Superplot if their plotTypes are the same
        /**
        if (subPlot.constructor == plot.constructor){
          subPlot.setProperties(filteredProps)
        }
        */

        // Setup superplot and back button
        plot._setSubPlot(subPlot);
        subPlot._setSuperPlot(plot);
        subPlot.refresh();
        const backButtonProperties = { label: '⏎  Back' , id: 'back' }
        subPlot.addButton(backButtonProperties, () => {
            plot._setSubPlot(null);
            subPlot._backToSuperPlot();
        })
    }
}