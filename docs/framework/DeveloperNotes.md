[Framework Documentation](../README.md)

# Important Notes for Developers

## Add Properties Handler to a new Class

Extending a custom class from ObjectWithProperties will automatically define the getters, setters and initial configurations to support custom Properties Object.

    class someClass extends ObjectWithProperties {
        static defaultProperties = {
            // Define initial values for your properties
        }
        
        constructor(){
            const props = {}; // Define or obtain properties
            super(props);
            // ...
        }
    }


## Define Custom Setter for a Parameter

    static defaultProperties = {
        //...
        CUSTOM_PARAMETER = "DEFAULT_VALUE",
    }

    CUSTOM_SETTER_FUNCTION(){

    }

    defineSetters(){
        super.defineSetters();

        // Custom Setter Function
        this.customSetters.PARAMETER_NAME = (v)=>this.CUSTOM_SETTER_FUNCTION.call(this,v);
    }

## Define Custom Function to be executed after Property Setter is succesfull

    static defaultProperties = {
        //...
        CUSTOM_PARAMETER = "DEFAULT_VALUE",
    }

    CUSTOM_SETTER_FUNCTION(){

    }

    defineSetters(){
        super.defineSetters();

        // Custom Setter Function
        this.customSetters.PARAMETER_NAME = (v)=>this.CUSTOM_SETTER_FUNCTION.call(this,v);
    }