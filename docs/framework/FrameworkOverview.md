[Framework Documentation](../README.md)

# Framework Overview

## Main Pillars of the Framework

1. Properties
    * Centralizes the storage of properties / attributes of a class.
    * Follows type validations based on specified rules.
    * Automatizes the management of the properties.
    * Normalizes incoming values based on the specified rules.
    * Works with the simplicity of a Dictionary but with the robsutness of a Class, taking advantage of the benefits of Object Oriented Programming.

2. ObjectWithProperties
    * Automatically defines

3. Component
    * Standardizes the development of Visual Components.
    * Automatically implements standard visual methods for your components (hide, show, render in DOM, dettach from DOM, refresh).

4. SvgVisualization


## 1. Properties

Properties Class centralizes and automatizes the management of the different properties (attributes) that are used by any class.

The storage system works as a dictionary (key, value), that can handle automatically the initialization of the values based on given default values, which are specified in the implementation of each class.

Example of a valid definition of default values:

```
defaultProperties = {
    fontFamily: 'arial',
    fontSize: 10,
    showDetails: true,
    margin: {top:0 , bottom: 0 , left: 0 , right : 0}
}
```

Additionally, the Properties class is able to define automatically setter functions. A Rule defines criteria that enables the automatic definition of setter functions that perform type validation to prevent incorrect configuration of any of the classes that belongs to the Framework. If a property doesn't have a rule definition, the setter function will simply set any not null value.

An example of supported rules are:

```
rules = {
    fontFamily : { type : "string" },
    fontSize : { type : "number" },
    showDetails : { type : "boolean" },
    margin : { type : "dictionary" , subtype : "number" }
}
```

If you Class needs to perform a specific action after changing the value of a property, you can define an **afterSetter** function. This function will only be executed if value changes.

### Usage

**Create a Properties Object**
```
props = new ddv.properties.Properties()

// Alternatively, you can pass a valid dictionary of rules
rules = {
    fontFamily : { type : "string" }
}
props = new ddv.properties.Properties(rules)
```

**Define values individually**

```
props.fontSize = 12
props.fontFamily = 'Times New Roman'
props.margin = { 'top' : 10 }
```

**Define multiple values at once**

```
defaultProperties = {
    fontSize: 12,
    fontFamily: 'Times New Roman',
    margin : { top : 10 }
}

props.setProperties(defaultProperties)
```

**Define Custom Setter**
```
function setAge(age){
    if (age < 0) console.log('Warning: Default')
    else this.age = age;
}

props.defineCustomSetter('age', setAge)

props.age = 10;
```

**Define Custom Function to be executed after setter**
```
function hideLegend(value) {
    console.log('This will be executed after hideLegend is enabled or disabled');
}

props.defineAfterSetter('hideLegend', hideLegend)

// Function will be executed automatically after this modification
props.hideLegend = true;

```

## 2. ObjectWithProperties

You can integrate all the benefits of Parameter Class in any of your Classes by extending it to `ddv.properties.ObjectWithProperties`. You can define initial values for your properties adding values to the static Dictionary called defaultProperties.

The constructor of the class ObjectWithProperties will automatically collect all the default properties and rules properties and will configure the Properties object

### Usage

**Defining your Custom Class**
```
class CustomClass extends ObjectWithProperties {
    static defaultProperties = {
        backgroundColor: '#F0F0F0'
    }

    static rulesProperties = {
        backgroundColor: { type : 'string' }
    }

    constructor(data, props){
        super(data,props);
        // Your implementation goes here
    }

    defineSetters(){
        super.defineSetters();
        // Here you can define custom setters and afterSetters automatically
        this.customSetters.exampleParam = customSetterForExampleParam,
        this.afterSetters.anotherParam = customAfterSetter,
    }
}
```

**Instanciating your Custom Class**

```
const custom = new CustomClass(data,props);
const { backgroundColor } = custom.properties;

// CustomClass will internally call the function 
// customSetterForExampleParam defined above

custom.properties.exampleParam = 'exampleValue';

// CustomClass will internally call the function customAfterSetter
// defined above only if value changes

custom.properties.anotherParam = 'anotherValue';
```

## 3. Component

A Component is an abstraction of a Visual Element that renders elements in the DOM based on a given input data and some given properties (attributes). All the Components are Children of the class ObjectWithProperties.

### Usage

**Defining your Custom Class**

```
class CustomClass extends Component {
    static defaultProperties = {
        //
    }

    static rulesProperties = {
        //
    }

    constructor(data, props){
        super(data,props);
        // Your implementation goes here
    }

    draw(data){
        const { ... } = this.properties;
        const { mainContainer } = this.getComponents();

        // You must append all the visual elements to mainContainer
    }
}
```

**Instanciating your Custom Class**
```
<div id="component"></div>
```

```
component = new CustomClass(data, props);
component.refresh()
component.appendOn('div#component')
```
