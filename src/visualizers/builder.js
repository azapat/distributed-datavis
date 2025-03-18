const courses = require("../data/Courses");
const jobs = require("../data/Jobs");
const { CourseVisualizer } = require("./list/CourseVisualizer");
const { JobVisualizer } = require("./list/JobVisualizer");
const { buildWordMap } = require("./wordmap/builder");

function normalizeType(type){
    if (typeof(type) !== 'string') return type;
    type = type.toLowerCase()
    switch (type) {
        case 'hexagon':
        case 'wordmap':
        case 'hexagonmap':
            return 'hexagon'
        case 'coursevisualizer':
        case 'course':
        case 'courses':
        case 'trainings':
        case 'training':
            return 'courses'
        case 'jobs':
        case 'job':
        case 'jobvisualizer':
            return 'jobs';
        default:
            return type;
    }
}

function normalizeData(data, visualType, provider){
    if (typeof(provider) !== 'string') return data;

    if (visualType == 'jobs'){
        data = jobs.process(data, provider);
    } else if (visualType == 'courses'){
        data = courses.process(data, provider);
    }
    return data;
}

function buildVisualization(visualInfo){
    var { type, provider, properties, data } = visualInfo;
    type = normalizeType(type);
    var props = properties;
    data = normalizeData(data, type, provider);

    var visual = null;
    switch (type) {
        case 'hexagon':
            visual = buildWordMap(data,'hexagon',props);       
            break;
        case 'courses':
            visual = new CourseVisualizer(props);
            visual.draw(data);
            break;
        case 'jobs':
            visual = new JobVisualizer(props);
            visual.draw(data);
            break;
        default:
            break;
    }
    return visual;
}

function buildRulesForSingleMap(params){
    const jsonUrl = params['jsonUrl'];

    const rules = {
        visuals: [
            {
                type: 'HexagonMap',
                url: jsonUrl,
                properties: params,
            }
        ],
    
        'properties' : {showTitle:false, showButtons:false},
    }

    return rules;
}

const builder = {
    buildVisualization,
    buildRulesForSingleMap,
}

module.exports = builder;