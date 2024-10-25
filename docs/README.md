# Distributed data visualization BB

[Design document](design-document.md)

* [Overview of the Visualization Framework](./framework/FrameworkOverview.md)
* [Class Diagram of the Framework](./framework/ClassDiagrams.md)
* [Diagram of Properties](./framework/PropertiesDiagram.md)
* [Important Notes for Developers](./framework/DeveloperNotes.md)

**Usage:**

[WordMaps / Graphs / DigitalTwins](./framework/usage/WordMap.md)

## Compress Source Code into single JavaScript Library File

To compress all the source files (.js and .css) into one single .js file, you must perform the following command:

```
npm install
npx webpack-cli
```

## Serve Library for Testing and Development

```
npx webpack-cli serve --mode development

npx webpack-cli serve --mode production
```