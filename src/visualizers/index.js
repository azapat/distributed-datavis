// Packages
const axis = require('./axis');
const list = require('./list');
const svg = require('./svg');
const tooltip = require('./tooltip');
const wordmap = require('./wordmap');
const groups = require('./groups');
const ResponsiveUtils = require('./responsive.utils');
const VisualizationSeries = require('./groups/VisualizationSeries');
const builder = require('./builder');

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
}

module.exports = visualizers;