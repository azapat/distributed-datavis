import * as d3Core from 'd3';
import { hexbin as d3hexbin } from 'd3-hexbin';

const d3 = { ...d3Core, hexbin: d3hexbin };
global.d3 = d3;

import * as ddv from '../../src/index.js';

// Jest Dependencies - Configuration JSDOM
import { TextEncoder, TextDecoder } from 'util';
global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;

import { sampleRules } from "../samples/Series.sample.js";

function main() {
    const rules = sampleRules;
    var visualization = new ddv.visualizers.VisualizationSeries(rules);
    visualization.attachOn('div#ddv');
    visualization.refresh();

    const waitTimeRender = 1000;

    // Params
    const { activeColor, inactiveColor } = rules.properties;

    var { activeVisual, navButtons } = visualization.getComponents();

    test('ActiveVisual=0 (DigitalTwin)', async () => {
        visualization.draw(0);
        await new Promise(resolve => setTimeout(resolve, waitTimeRender));

        var nElements = activeVisual.select('ul.listContainer').selectAll('li.listElement').size();
        var buttonColor = navButtons.select('circle[index="0"]').attr('fill');
        expect(nElements).toBe(1);
        expect(buttonColor).toBe(activeColor);

        buttonColor = navButtons.select('circle[index="1"]').attr('fill');
        expect(buttonColor).toBe(inactiveColor);
    });

    test('ActiveVisual=1 (DigitalTwin)', async () => {
        visualization.draw(1);
        await new Promise(resolve => setTimeout(resolve, waitTimeRender));

        var nElements = activeVisual.select('ul.listContainer').selectAll('li.listElement').size();
        var buttonColor = navButtons.select('circle[index="1"]').attr('fill');
        expect(nElements).toBe(0);
        expect(buttonColor).toBe(activeColor);

        buttonColor = navButtons.select('circle[index="0"]').attr('fill');
        expect(buttonColor).toBe(inactiveColor);
    });

    test('ActiveVisual=2 (Jobs)', async () => {
        visualization.draw(2);
        await new Promise(resolve => setTimeout(resolve, waitTimeRender));

        var nElements = activeVisual.select('ul.listContainer').selectAll('li.listElement').size();
        var buttonColor = navButtons.select('circle[index="2"]').attr('fill');
        expect(nElements).toBe(2);
        expect(buttonColor).toBe(activeColor);

        buttonColor = navButtons.select('circle[index="0"]').attr('fill');
        expect(buttonColor).toBe(inactiveColor);
    });
}

describe('HexagonMap Properties Tests', () => {
    test('Sample', () => expect(1).toBe(1));
    main();
});