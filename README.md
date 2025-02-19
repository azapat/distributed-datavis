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

The previous command will compile a JS file that can be imported and processed by the browser. If you want to create a JS file that can be imported in an existing NodeJS project, you can execute:

    npm run build


## Running instructions (with container)

This command will build and run the docker container that will serve the building block in the port 8080 of the host system.

    docker compose up --build


## Running instructions (without container)

You can serve the library for testing and development executing the following commands:

```
npx webpack-cli serve --mode development

npx webpack-cli serve --mode production
```

## Example usage

You can access the components directly by accessing the following routes:

| Endpoint              | Example input | Expected output   |
| -------------         | ------------- | ----------------- |
| /ptx-ddv.js           |               | DDV JS Library    |
| /test/DDV.html        |               | Sample visualization with Course Recommendations, 1 Digital Twin and Job Recommendations.   |

Any HTML file that is present in the /test folder will be automatically served by webpack.

## Unit testing
### Setup test environment

Tests are executed under a running instance of the application. Before executing the tests, make sure that you followed the instructions to run the application
[with container](#running-instructions-with-container) or [without container](#running-instructions-without-container).

### Run tests

#### A) Run tests without containers

You can execute the unitary tests and the functional tests of the project with the following commands:

```
npm run build
npm test
```

#### B) Run tests in a container instance

Once the container is up and running, you can execute the unitary tests and the functional tests of the project on it with the following commands:

    docker exec -it <container_name_or_id> npx jest

Example

    docker exec -it distributed-datavis-ddv-1 npx jest

### Expected results

```
> test
> jest

 PASS  __tests__/properties/HexagonMap.test.js
 PASS  __tests__/properties/Properties.test.js
 PASS  __tests__/visualizers/HexagonMap.test.js
 PASS  __tests__/visualizers/VisualizationSeries.test.js (6.763 s)

Test Suites: 4 passed, 4 total
Tests:       71 passed, 71 total
Snapshots:   0 total
Time:        7.806 s
Ran all test suites.
```

## Component-level testing

The Distributed Data Visualizer does not integrate its funcionalities with the Dataspace connector or with other Building Blocks in a direct way. For this reason, Component-level tests will be empty.

### Setup test environment
### Run tests
### Expected results
