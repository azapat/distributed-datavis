import colors from "../../data/digitalTwin/colors";
import { LineChart } from "../axis";
import Tooltip from "../tooltip/Tooltip";
import HexagonMap from "./HexagonMap";

export class HexagonMapWithTimeSeries extends HexagonMap {
    static defaultProperties = {
        actionOnClick: 'showvalues',
    }

    constructor(props) {
        const tooltipProps = props.tooltipProps || {};
        delete props.tooltipProps;
        super(props);
        this.setTooltipProperties(tooltipProps);
    }

    setTooltipProperties(props){
        this.tooltipProperties = props;
    }

    plot(data){
        colors.configureMapWithTimeSeries(this);
        super.plot(data);
        const timeLabels = plot.digitalTwin.originalData.info.timeLabels;
        const tooltipProps = {timeLabels};
        this.setTooltipProperties(tooltipProps);
        this.enableLinechartTooltip();
    }

    enableLinechartTooltip() {
        const plotType = 'linechart';
        const {
            width, height,
        } = plot.getProperties();

        const props = this.tooltipProperties;

        if (plotType == null) return;
        if (typeof (plotType) !== "string") return;
        var { outerSVG } = plot.getComponents();
        const tooltipId = '_tooltip_chart';
        const tooltipSVG = outerSVG.selectAll('svg#' + tooltipId).data([null]).enter()
            .append('svg')
            .attr('class', 'tooltipChart')
            .attr('id', tooltipId);

        const {
            padding = 20
        } = props;

        const tooltip = new Tooltip(tooltipId, props);
        plot.tooltipChart = tooltip;
        const tooltipWidth = width - (2 * padding);
        const tooltipHeight = height - (2 * padding);
        tooltip.setSize(tooltipWidth, tooltipHeight);
        tooltip.hide();

        const funcAfterHide = () => {
            if (plot.tooltipChart == null) return;
            const { innerSVG } = plot.getComponents();
            innerSVG.style('opacity', 1)
        }

        const funcAfterShow = () => {
            if (plot.tooltipChart == null) return;
            const { innerSVG } = plot.getComponents();
            innerSVG.style('opacity', 0.2)
        }

        tooltip.executeFunctionAfterHide(funcAfterHide);
        tooltip.executeFunctionAfterShowing(funcAfterShow);

        // It's important to specify that the chart will be contained in a SVG, not in a DIV
        props['parentHtmlTag'] = 'svg';
        plot.tooltipSubPlot = new LineChart(tooltipId, props);
    }
}