function debounce(func, wait) {
    var timeout;
    return function (...args) {
      clearTimeout(timeout);
      timeout = setTimeout(() => func.apply(this, args), wait);
    };
}

function resizeObserverAux (entries){
    for (let entry of entries) {
        const width = entry.contentRect.width;
        const height = entry.contentRect.height;
        const oldWidth = visualization.properties.width;
        const oldHeight = visualization.properties.height;
        if (width == oldWidth && height == oldHeight) continue;
        visualization.setProperties({width,height});
        visualization.refresh();
    }
};



function enableResponsiveness(visualization){
    const { margin } = visualization.properties;
    const width = window.innerWidth - margin.left - margin.right;
    const height = window.innerHeight - margin.top - margin.bottom;
    visualization.setProperties({width, height});
    visualization.refresh();

    const parent = visualization.parent;
    parent.attr('width','100%');

    const { mainContainer } = visualization.components;
    const horizontalMargin = margin.left + margin.right;
    const verticalMargin = margin.top + margin.bottom;
    mainContainer.style('width',`calc(100% - ${horizontalMargin}px)`)
        .style('height',`calc(100% - ${verticalMargin}px)`);
}

function enableResponsivenessToSeries(visualization){
    enableResponsiveness(visualization);
    
    const parent = visualization.parent;
    parent.style('overflow','hidden')
        .style('height','100%');

    const activeVisual = visualization.components.activeVisual;
    activeVisual.style('overflow','auto');

    const timeout_ms = 10;
    var resizeObserver = debounce((entries)=>{resizeObserverAux(entries)},timeout_ms);
    const observer = new ResizeObserver(resizeObserver);
    observer.observe(visualization.parent.node());
}

const ResponsiveUtils = {
    enableResponsiveness,
    enableResponsivenessToSeries,
}

module.exports = ResponsiveUtils;