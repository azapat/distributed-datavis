const ObjectWithProperties = require("../properties/ObjectWithProperties");

class Component extends ObjectWithProperties {
    static defaultProperties = {
        fontSize: 14,
        fontFamily: 'sans-serif',
        containerTag: 'div',
        margin: {top:0, right:0, bottom:0, left:0},
        width: 50,
        height: 50,
        backgroundColor: '#F9F9F9',
    }

    static rulesProperties = {
        fontSize : { type : 'number' },
        fontFamily : { type : 'string' },
        containerTag : { type : 'string' },
        margin: { type: 'dictionary' , subtype: 'number' },
        width: { type : 'number' },
        height: { type : 'number' },
        backgroundColor: { type : 'string' },
    };

    components = {
        mainContainer: null,    
    }

    parent = null;
    error = null;

    constructor(data,props){
        super(props);
        this.data = data;
        this.initComponents();
    }

    getData(){
        return this.data;
    }

    setData(data){
        this.data = data;
    }

    getComponents(){
        return this.components;
    }

    _createDettachedElement(tag){
        switch (tag) {
            case 'svg':
                return document.createElementNS('http://www.w3.org/2000/svg','svg');
            case 'div':
            default:
                return document.createElement(tag);
        }
    }

    initComponents(){
        const { containerTag } = this.properties;

        var mainContainer = this._createDettachedElement(containerTag);
        mainContainer = d3.select(mainContainer).classed('component',true).classed('componentContainer',true);

        this.components.mainContainer = mainContainer;
    }

    draw(data){
        const { width , height , margin } = this.properties;
        const { mainContainer } = this.components;

        mainContainer.style('margin-top',margin?.top)
            .style('margin-bottom',margin?.bottom)
            .style('margin-left',margin?.left)
            .style('margin-right',margin?.right)
            .style('padding','0px')
            .style('width',`${width}px`)
            .style('height',`${height}px`);
    }

    refresh(){
        const data = this.getData();
        this.draw(data);
    }

    render(){
        return this.components.mainContainer;
    }

    attachOn(selectionQuery){
        const render = this.render().node();
        this.parent = d3.select(selectionQuery);
        this.parent.append(()=>render);
    }

    attachOnSelection(selection){
        const render = this.render().node();
        this.parent = selection;
        this.parent.append(()=>render);
    }

    detach(){
        this.components.mainContainer.remove();
    }

    reattach(){
        if (this.parent == null) return;
        this.detach();
        const render = this.render().node();
        this.parent.append(()=>render);
    }

    hide(){
        this.components.mainContainer.style('display','none');
    }

    show(){
        this.components.mainContainer.style('display','unset');
    }
}

module.exports = Component;