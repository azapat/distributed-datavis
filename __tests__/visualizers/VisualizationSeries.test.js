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

const { sampleRules } = require("../samples/Series.sample");

function main(){
    const rules = sampleRules;
    visualization = new ddv.visualizers.VisualizationSeries(rules);
    visualization.attachOn('div#ddv');
    visualization.refresh();

    const waitTimeRender = 1000;

    // Params
    const { activeColor, inactiveColor } = rules.properties;

    var { activeVisual , navButtons } = visualization.getComponents();

    test('ActiveVisual=0 (DigitalTwin)', async ()=>{
        visualization.draw(0);
        await new Promise(resolve => setTimeout(resolve, waitTimeRender));
    
        nElements = activeVisual.select('ul.listContainer').selectAll('li.listElement').size();
        buttonColor = navButtons.select('circle[index="0"]').attr('fill');
        expect(nElements).toBe(1);
        expect(buttonColor).toBe(activeColor);

        buttonColor = navButtons.select('circle[index="1"]').attr('fill');
        expect(buttonColor).toBe(inactiveColor);
    });

    test('ActiveVisual=1 (DigitalTwin)', async ()=>{
        visualization.draw(1);
        await new Promise(resolve => setTimeout(resolve, waitTimeRender));
    
        nElements = activeVisual.select('ul.listContainer').selectAll('li.listElement').size();
        buttonColor = navButtons.select('circle[index="1"]').attr('fill');
        expect(nElements).toBe(0);
        expect(buttonColor).toBe(activeColor);

        buttonColor = navButtons.select('circle[index="0"]').attr('fill');
        expect(buttonColor).toBe(inactiveColor);
    });

    test('ActiveVisual=2 (Jobs)', async ()=>{
        visualization.draw(2);
        await new Promise(resolve => setTimeout(resolve, waitTimeRender));
    
        nElements = activeVisual.select('ul.listContainer').selectAll('li.listElement').size();
        buttonColor = navButtons.select('circle[index="2"]').attr('fill');
        expect(nElements).toBe(2);
        expect(buttonColor).toBe(activeColor);

        buttonColor = navButtons.select('circle[index="0"]').attr('fill');
        expect(buttonColor).toBe(inactiveColor);
    });
}

describe('HexagonMap Properties Tests', ()=>{
    test('Sample',()=>expect(1).toBe(1));
    main();
});