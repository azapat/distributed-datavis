const ObjectWithProperties = require("./ObjectWithProperties");
const Properties = require("./Properties");
const utils = require('./utils');

const properties = {
    ObjectWithProperties,
    Properties,
    ...utils,
}

module.exports = properties;