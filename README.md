# Distributed data visualization BB

Distributed Data Visualisation is an on-device building block to ease up building end-user UIs for showing data in an informative way. It allows AI providers to display the results of their analytics, predictions and recommendations. The building block is a reusable component that can be displayed by UI provider from any source.

See technical details about development and testing [here](docs/README.md).

See Release Notes [here](docs/framework/ReleaseNotes.md).

## Design Document
See the design document [here](docs/design-document.md).

## Building instructions
To compress all the source files (.js and .css) into one single .js file, you must perform the following command:

    npm install
    npx webpack-cli

## Running instructions

You can serve the library for testing and development executing the following commands:

```
npx webpack-cli serve --mode development

npx webpack-cli serve --mode production
```

## Example usage
_Describe how to check some basic functionality of the BB._
E.g.:

Send the following requests to the designated endpoints:
| Endpoint              | Example input | Expected output   |
| -------------         | ------------- | ----------------- |
| /ptx-ddv.js           |               | DDV JS Library    |
| /test/DDV.html        |               | Sample visualization with Course Recommendations, 1 Digital Twin and Job Recommendations                 |

Any HTML file that is present in the /test folder will be automatically served by webpack.