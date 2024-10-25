# WordMap Usage

**HTML Section**

```
<div id="mindmap"></div>
```

**Javascript Section**

```
const plotType = 'hexagon';
const props = { width : 1200 , height : 800 };

plot = ddv.visualizers.wordmap.buildWordMap(json, plotType, props);
ddv.data.digitalTwin.colors.setColorsToMindMap(plot);
plot.attachOn('div#mindmap')
plot.refresh();
```