function centerMap(plot) {
    const { mainContainer } = plot.getComponents();
    const concepts = mainContainer.selectAll('svg.concept').nodes();
    if (concepts.length == 0) return;

    // Give initial values
    var xMin = concepts[0].getAttribute('x');
    var yMin = concepts[0].getAttribute('y');
    var xMax = xMin;
    var yMax = yMin;
    // Find min and max
    for (var i = 0; i < concepts.length; i++) {
        const concept = concepts[i];
        const x = Number.parseFloat(concept.getAttribute('x'));
        const y = Number.parseFloat(concept.getAttribute('y'));
        if (x < xMin) xMin = x
        if (y < yMin) yMin = y
        if (x > xMax) xMax = x
        if (y > yMax) yMax = y
    }

    const figureSize = concepts[0].hasAttribute('width') ? Number.parseFloat(concepts[0].getAttribute('width')) : 0;
    const radius = figureSize / 2;

    xMin -= radius;
    xMax += radius;

    //yMin -= radius;
    //yMax += radius;

    const width = xMax - xMin;
    //const height = yMax - yMin;

    const scale = plot.getProperties().width / width;

    var initialX = (-xMin - radius) * scale;
    var initialY = (-yMin) * scale;

    plot.properties.initialPosition = [initialX, initialY];
    plot.properties.initialZoom = scale;
    plot.translateVisualization(initialX, initialY, scale);
}

const WordMapUtils = {
    centerMap,
}

module.exports = WordMapUtils;