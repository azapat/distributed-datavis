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

    npx webpack-cli --mode production --target node


## Running instructions (with container)

This command will build and run the docker container that will serve the building block in the port 8080 of the host system.

    docker compose up --build

Once the container is up and running, you can execute the unitary tests and the functional tests of the project on it with the following commands:

    docker exec -it <container_name_or_id> npx jest

Example

    docker exec -it distributed-datavis-ddv-1 npx jest


## Running instructions (without container)

You can serve the library for testing and development executing the following commands:

```
npx webpack-cli serve --mode development

npx webpack-cli serve --mode production
```

You can execute the unitary tests and the functional tests of the project with the following commands:

```
npx webpack-cli --mode production --target node
npm test
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
### Run tests
### Expected results

## Component-level testing
### Setup test environment
### Run tests
### Expected results
