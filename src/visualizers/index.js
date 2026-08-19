// Packages
import axis from './axis';
import list from './list';
import svg from './svg';
import tooltip from './tooltip';
import wordmap from './wordmap';
import groups from './groups';
import ResponsiveUtils from './responsive.utils';
import VisualizationSeries from './groups/VisualizationSeries';
import builder from './builder';
import legends from './legends';

const visualizers = {
    axis,
    list,
    svg,
    tooltip,
    wordmap,
    groups,
    responsive: ResponsiveUtils,
    VisualizationSeries,
    builder,
    legends,
}

export default visualizers;