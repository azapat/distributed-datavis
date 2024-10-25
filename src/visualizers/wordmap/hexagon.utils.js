function getRelativeHexagonPosition(plot, label, zoom){
    const {width, height} = plot.getProperties();
    var concept = plot.digitalTwin.getNodeInfoByLabel(label);

    const radius = plot.properties.figSize;
    const hexaWidth = radius * Math.sqrt(3);
    const hexaHeight = radius * 2;

    var xIndex = concept['x'];
    var yIndex = concept['y'];

    var xConcept = HexagonUtils.getHexagonCenter(radius, yIndex, xIndex)[0];
    xConcept = xConcept - hexaWidth / 2;

    var yConcept = HexagonUtils.getHexagonCenter(radius, yIndex, xIndex)[1];
    yConcept = yConcept - hexaHeight / 2

    var x = width / 2 / zoom - hexaWidth / 2 - xConcept;
    x = x * zoom;
    var y = height / 2 / zoom - hexaHeight / 2 - yConcept;
    y = y * zoom;

    return {x,y};
}

function getHexagonCenter(hexaRadius, row, col) {
    var x = hexaRadius * col * Math.sqrt(3)
    //Offset each uneven row by half of a 'hex-width' to the right
    if (row % 2 === 1) x += (hexaRadius * Math.sqrt(3)) / 2
    var y = hexaRadius * row * 1.5
    return [x + hexaRadius, y + hexaRadius];
}


function getEdgeCoordinates(plot) {
    const r = plot.properties.figSize;
    var w = Math.sqrt(3) * r; // var h = 2 * r;

    // Space to draw Lines around hexagons
    var s = 0;
    // Vertices
    var v = {
        a: [0 + s, r / 2],
        b: [w / 2, 0],
        c: [w - s, r / 2],
        d: [w - s, 3 * r / 2],
        e: [w / 2, 2 * r],
        f: [0 + s, 3 * r / 2]
    }

    var hexagonEdges = {
        s1: { from: v.a, to: v.b },
        s2: { from: v.b, to: v.c },
        s3: { from: v.c, to: v.d },
        s4: { from: v.d, to: v.e },
        s5: { from: v.e, to: v.f },
        s6: { from: v.f, to: v.a },
    }

    return hexagonEdges;
}

const HexagonUtils = {
    getRelativeHexagonPosition,
    getEdgeCoordinates,
    getHexagonCenter,
}

module.exports = HexagonUtils;