const d3 = require('d3');
const d3hexbin = require('d3-hexbin').hexbin;
d3.hexbin = d3hexbin;
global.d3 = d3;
global.d3.hexbin = d3hexbin;
const ddv = require('../../dist/ptx-ddv');

// Jest Dependencies - Configuration JSDOM
const { TextEncoder, TextDecoder } = require('util');
global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;

const { digitalTwinJson } = require('../samples/DigitalTwin.sample');

function main(){
    const json = digitalTwinJson;
    d3.select('body').append('div').attr('id','mindmap');
    var plot = null;
    const plotType = 'hexagon';
    const props = {
        width:1200,
        height:800,
        margin:{top:20,bottom:20,left:20,right:20},
        fontSize: 20,
        fontFamily: 'Arial',
        colors:['#F0F000'],
        figSize: 100,
        initialZoom: 1.5,
    };
    plot = ddv.visualizers.wordmap.buildWordMap(json, plotType, props);
    plot.attachOn('div#mindmap')
    ddv.visualizers.responsive.enableResponsiveness(plot);
    plot.refresh();

    const visual = d3.select('div#mindmap');

    const { container } = plot.getComponents();

    test('Outer Structure of the Visualization:', () => {
        const scale = container.attr('transform').split(' ')[1]
        const zoom = props['initialZoom'];
        expect(scale).toBe( `scale(${zoom})`);
    });

    const nNodes = visual.selectAll('svg.concept').size();
    test('Count Nodes:', () => expect(nNodes).toBe(226))

    const nodeId = 14;
    const mainNode = visual.select(`svg[nodeId="${nodeId}"]`);
    const path = mainNode.select('path');
    const text = mainNode.select('text.textInside');

    test('Svg Concept Attributes:', () => {
        expect( mainNode.attr('nodeId') ).toBe(nodeId.toString());
        expect( mainNode.attr('class') ).toBe('concept');
        expect( path.attr('fill').toUpperCase() ).toBe(props['colors'][0]);
        expect( text.style('font-family')).toBe(props['fontFamily']);
        expect( text.style('font-size')).toBe(props['fontSize'].toString() + 'px');

        var hexaRadius = props.figSize;
        var hexaHeight = hexaRadius * 2;
        var hexaWidth = hexaRadius * Math.sqrt(3);
        expect( parseFloat(mainNode.attr('height')) ).toBe(hexaHeight);
        expect( parseFloat(mainNode.attr('width')) ).toBe(hexaWidth);
    });
}


describe('HexagonMap Tests', ()=>{
    main();
});
