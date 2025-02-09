//import * as d3 from 'd3';
//import { JSDOM } from 'jsdom';
const d3 = require('d3');
global.d3 = d3;
const ddv = require('../../dist/ptx-ddv');
const $ = require('jquery');
const axios = require('axios');

// Jest Dependencies - Configuration JSDOM
const { TextEncoder, TextDecoder } = require('util');
global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;
const {JSDOM} = require('jsdom');

async function main(){
    var plot = null;
    // Sources (Sample CV File)
    var url = 'https://megatron.headai.com/analysis/TextToGraph/TextToGraph_10wpxMCmDE1715179575391.json';

    //const dom = new JSDOM('<!DOCTYPE html><body><div id="mindmap"></div></body></html>');
    //global.document = dom.window.document;
    //global.window = dom.window;
    //global.window = global.document.defaultView;

    d3.select('body').append('div').attr('id','mindmap');

    const json = await axios.get(url);
    const plotType = 'hexagon';
    const props = {width:1200,height:800,margin:{top:20,bottom:20,left:20,right:20}};
    plot = ddv.visualizers.wordmap.buildWordMap(json, plotType, props);
    plot.attachOn('div#mindmap')
    ddv.visualizers.responsive.enableResponsiveness(plot);
    plot.refresh();

    const visual = d3.select('div#mindmap');

    const nNodes = visual.selectAll('svg.concept').size();
    test('Count Nodes:', async () => expect(nNodes).toBe(226))

    const nodeId = 14;
    const mainNode = visual.select(`svg[nodeId="${nodeId}"]`);
    //test('Main Concept:')
}

test('Count Nodes:', async () => expect(10).toBe(10))
main()
//test('Count Nodes:', async () => expect(10).toBe(10))