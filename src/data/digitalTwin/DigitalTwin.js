const ObjectWithProperties = require("../../properties/ObjectWithProperties");
const SkillsUtils = require("../skills.utils");
const DigitalTwinProcessing = require("./DigitalTwinProcessing");
const shrink = require("./shrink");

class DigitalTwin extends ObjectWithProperties {
/**

nodes
edges
ids

neighbors { id : Array }

isNeighbor(a,b)
getNeighbors(a)
getNodeInfoById(id)
getNodeInfoByLabel(label)


*/
    static defaultProperties = {
        onlyCompounds: false,
        filterMinWeight : 0,
        filterMinValue : 0,
        filterGroups : [],
        maxNodes: null,
        valueField: 'value',
        hideNodes: [],
        subgraph: null,
    }

    static rulesProperties = {
        onlyCompounds: {type:'boolean'},
        filterMinWeight: {type:'number'},
        filterMinValue: {type:'number'},
        filterGroups: {type:'array', subtype:'number'},
        maxNodes: {type:'number'},
        valueField: {type:'string'},
        hideNodes: {type:'array', subtype:'string'},
        subgraph: {type:'string'},
    }

    defineSetters(){
        super.defineSetters();
        this.customSetters.subgraph = (v)=>this.setSubgraph.call(this,v);
    }

    constructor(json, props){
        super(props);
        this.originalData = JSON.parse(JSON.stringify(json));

        this._nodes = [];
        this._edges = [];
        this._neighbors = {};
        this._idToIndex = {};
        this._labelToIndex = {};

        const { valueField } = this.properties;

        const { nodes , edges } = this.getOriginalData();
        const sortedNodes = DigitalTwinProcessing.sortArrayOfObjects(nodes,valueField);
        const sortedEdges = DigitalTwinProcessing.sortArrayOfObjects(edges,valueField);
        this.#modifyOriginalData({
            nodes: sortedNodes,
            edges: sortedEdges,
        });

        this._processData();
        this.nodesHaveRelations = DigitalTwinProcessing.doNodesHaveRelations(sortedNodes);
    }

    setProperties(props){
        var { reprocess , changes } = super.setProperties(props);

        const refreshFields = [
            'filterMinWeight','filterMinValue','filterGroups','onlyCompounds','hideNodes','maxNodes',
        ];

        for (let i = 0; i < refreshFields.length; i++) {
            const field = refreshFields[i];
            if (changes[field] != null){
                reprocess = true;
                break;
            }
        }

        if (reprocess === true) this._processData();

        return { reprocess , changes };
    }

    getData(){
        return {
            nodes: this._nodes,
            edges: this._edges,
            neighbors: this._neighbors,
            idToIndex: this._idToIndex,
            labelToIndex: this._labelToIndex,
        }
    }

    getOriginalData(){
        const original = this.originalData;

        if (original == null) return null;
        
        if (original.hasOwnProperty('data')){
            var data = original.data;
        } else {
            var data = original;
        }
        
        const title = original.title;
        const nodes = data.nodes;
        const edges = data.edges;
        const legends = data.legends;
        const uniqueIdentifier = data.unique_identifier;
        const indicators = data.indicators;

        return {
            title, 
            nodes, edges, legends, uniqueIdentifier, indicators,
        };
    }

    #modifyOriginalData(data){
        const {nodes,edges} = data;

        var data = this.originalData;
        if (data.hasOwnProperty(data)) data = data.data;

        if (Array.isArray(nodes)){
            data.nodes = nodes;
        }

        if (Array.isArray(edges)){
            data.edges = edges;
        }
    }

    getNeighborsById(id){
        const {neighbors} = this.getData();
        const neighborList = neighbors[id];
        if (neighborList == null) return [];
        return neighborList;
    }

    getNeighborsByLabel(label){
        const node = this.getNodeInfoByLabel(label);
        const id = node.id;
        const neighbors = this.getNeighborsById(id);
        return neighbors;
    }

    getNodeInfoById(id){
        const index = this._idToIndex[id];
        const {nodes} = this.getData();
        const node = nodes[index];
        return node;
    }

    getNodeInfoByLabel(label){
        const index = this._labelToIndex[label];
        const {nodes} = this.getData();
        const node = nodes[index];
        return node;
    }

    hasId(id){
        const { idToIndex } = this.getData();
        const has = idToIndex.hasOwnProperty(id);
        return has;
    }

    hasLabel(label){
        const { labelToIndex } = this.getData();
        const has = labelToIndex.hasOwnProperty(label);
        return has;
    }

    removeElementById(id){
        const label = this.getNodeInfoById(id).label;
        this.properties.hideNodes.push(label);
        this._processData();
    }

    removeListOfElementsByName(listOfElements){
        if (!Array.isArray(listOfElements)) return;
        
        listOfElements.forEach((label)=>{
            const { hideNodes } = this.getProperties();
            if (hideNodes.includes(label)) return;
            if (!this.hasLabel(label)) return;
            hideNodes.push(label);
        });
        this._processData();
    }

    _processData(){
        this._neighbors = {};
        this._idToIndex = {};
        this._labelToIndex = {};

        const originalData = this.getOriginalData();
        if (originalData == null) return;

        /**/
        var {nodes} = originalData;
        const { maxNodes , subgraph } = this.getProperties();

        const subgraphId = nodes.find((d)=>d.label == subgraph)?.id;
        const subgraphIsActive = (subgraphId != null);

        const willCalculateFilters = typeof(maxNodes) == 'number' && Array.isArray(nodes) && nodes.length > 0 && !subgraphIsActive;

        if (willCalculateFilters){
            const {minWeight, minValue, count} = shrink.findOptimalFilters(nodes, maxNodes);
            if (count != null) console.log(`Map Shrink: Nodes:'${count}', MinWeight:'${minWeight}', MinValue:'${minValue}'`);
            this.properties.filterMinWeight = minWeight;
            this.properties.filterMinValue = minValue;
        }
        /**/

        var {nodes,edges} = this.#filterData();

        this._nodes = nodes;
        this._edges = edges;

        this.#processNeighbors();
        
        // IdToIndex and LabelToIndex
        for (let i = 0; i < nodes.length; i++) {
            const id = nodes[i].id;
            const label = nodes[i].label;
            this._idToIndex[id] = i;
            
            if (this.hasLabel(label)) continue;
            this._labelToIndex[label] = i;
        }

        // Neighbors List
        const neighbors = this._neighbors;
        edges.forEach((edge)=>{
            const {from,to} = edge;
            if (neighbors[from] == null){
                neighbors[from] = new Set();
            }
            if (neighbors[to] == null){
                neighbors[to] = new Set();
            }

            neighbors[from].add(to);
            neighbors[to].add(from);
        });

        // Convert Sets to Lists
        Object.keys(neighbors).forEach((id)=>{
            neighbors[id] = Array.from(neighbors[id]);
        });
    }

    #filterData(){
        const {
            filterMinValue , filterMinWeight , filterGroups, onlyCompounds, hideNodes, subgraph
        } = this.getProperties();

        var { nodes , edges } = this.getOriginalData();

        const valueFilterIsActive = (filterMinValue > 0);
        const weightFilterIsActive = (filterMinWeight > 0);
        const groupFilterIsActive = (filterGroups.length > 0);
        const hideNodesIsActive = (hideNodes.length > 0);
        const subgraphId = nodes.find((d)=>d.label == subgraph)?.id;
        const subgraphIsActive = (subgraphId != null);
        const subgraphIds = this.#getRelatedIds(subgraphId, edges);
        subgraphIds.push(subgraphId);

        const filteredNodes = [];
        const filteredEdges = [];
        const filteredIds = new Set();

        const filteredData = {
            nodes: filteredNodes,
            edges: filteredEdges,
            ids: filteredIds,
        };
    
        const groups = new Set(filterGroups);
    
        // Filter nodes
        for (let i = 0; i < nodes.length; i++) {
            const node = nodes[i];
            DigitalTwinProcessing.normalizeNodeInfo(node);
            const {group,id,value,label,weight} = node;
    
            if (groupFilterIsActive && !groups.has(group)) continue;
            if (valueFilterIsActive && value < filterMinValue) continue;
            if (weightFilterIsActive && weight < filterMinWeight) continue;
            if (onlyCompounds && !DigitalTwinProcessing.isCompound(label)) continue;
            if (hideNodesIsActive && hideNodes.includes(label)) continue;
            if (subgraphIsActive && !subgraphIds.includes(id)) continue; // Id belongs to the subgraph filter

            // Filter if subgraph is active
            
            filteredNodes.push(node);
            filteredIds.add(id)
        }

        // Filter edges based on final nodes
        for (let i = 0; i < edges.length; i++) {
            const edge = edges[i];
            if (!filteredIds.has(edge.to) || !filteredIds.has(edge.from)) continue;
            filteredEdges.push(edge);
        }

        return filteredData;
    }

    #getRelatedIds(id, edges){
        var ids = new Set();
        for (let i = 0; i < edges.length; i++) {
            const edge = edges[i];
            const from = edge['from'];
            const to = edge['to'];
            if (from == id) ids.add(to);
            if (to == id) ids.add(from);
        }
        ids = Array.from(ids);
        return ids;
    }

    #processNeighbors(){
        const { edges , idToIndex } = this.getData();

        for (let i = 0; i < edges.length; i++) {
            const {from,to} = edges[i];
            if (idToIndex[from] == null) idToIndex[from] = new Set();
            if (idToIndex[to] == null) idToIndex[to] = new Set();

            idToIndex[from].add(to);
            idToIndex[to].add(from);
        }
    }

    setSubgraph(subgraph){
        subgraph = SkillsUtils.normalizeSkill(subgraph);
        this.properties.initializeProperty('subgraph',subgraph);
    }
}

module.exports = DigitalTwin;