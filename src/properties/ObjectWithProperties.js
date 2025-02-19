const Properties = require('./Properties');
const { mergeDictionaries, removeDictionaryKeys, cleanDictionary } = require('./utils');

class ObjectWithProperties {
    #properties = null;

    set properties(p){}
    
    get properties(){return this.getProperties();}
    
    // Setters
    customSetters = {};
    afterSetters = {};

    getProperties(){
        return this.#properties;
    }

    setProperties(newProps){
        var changes = {}
        var reprocess = false;
        if (newProps?.constructor !== Object || a.constructor == ddv.properties.Properties) return { changes , reprocess };
        changes = this.properties.setProperties(newProps);
        return { changes , reprocess };
    }

    static defaultProperties = {
        //
    }

    static rulesProperties = {
        //
    }

    constructor(props){
        props = props || {};

        this.#properties = new Properties(this.constructor.getRulesProperties());

        // Recursively catches all custom setters in all Child classes
        this.defineSetters();
        this.properties.defineSetters(this.customSetters);
        this.properties.defineAfterSetters(this.afterSetters);

        this.#initProperties(props);
        this.setProperties(props);
    }

    /**
     * This function will be called in all the constructors of the child classes above Visualization.
     * For this reason, it's important to make sure that setProperties is executed once on Visualization constructor,
     * and subsecuent calls of initVisualizerProperties with default params of all child constructors can only override 
     * @param {*} customProps 
     */
    #initProperties(customProps){
        customProps = cleanDictionary(customProps);
        var defaultProperties = this.constructor.getDefaultProperties() || {};
        // defaultProperties should stay inmutable
        defaultProperties = { ...defaultProperties };
        const keysToRemove = Object.keys(customProps);
        removeDictionaryKeys(defaultProperties, keysToRemove);
        this.setProperties(defaultProperties);
    }

    setProperties(newProps){
        const changes = this.properties.setProperties(newProps);
        return {changes};
    }

    defineSetters(){
        // Custom Setter and AfterSetter functions
    }

    static getDefaultProperties(){
        const parentFunction = this?.__proto__?.getDefaultProperties;
        const defaultParent = (typeof(parentFunction) == 'function') ? parentFunction.call(this.__proto__) : {};
        var defaultProperties = this.defaultProperties || {};
        defaultProperties = mergeDictionaries(defaultParent, defaultProperties);
        return defaultProperties;
    }

    static getRulesProperties(){
        const parentFunction = this?.__proto__?.getRulesProperties;
        const defaultParent = (typeof(parentFunction) == 'function') ? parentFunction.call(this.__proto__) : {};
        var rulesProperties = this.rulesProperties || {};
        rulesProperties = mergeDictionaries(defaultParent, rulesProperties);
        return rulesProperties;
    }
}

module.exports = ObjectWithProperties;