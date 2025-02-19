const { digitalTwinJson } = require("./DigitalTwin.sample");

const jobs = [
    {
        "url": "https://www.google.com/",
        "author": "Sample Company",
        "language": "English",
        "title": "Senior Data Scientist - Expert in Language Models",
        "description": "We require a Senior Data Scientist that has experience working with multiple language models",
        "location": "Helsinki, Finland",
        "time": "08/11/2024",
        "score": 10.4,
        "normalized_score": 0.8,
        "matching_skills": ["language_models", "natural_language_processing", "python"],
        "missing_skills": ["graph_neural_networks", "reinforcement_learning"]
    },{
        title: "Sample Minimal Job",
        description: "Minimal description",
    }
];

const courses = [
    {
        "code": "1047-942",
        "url": "https://www.google.com/",
        "title": "AI for All",
        "description": "Acquire a set of skills that will open the world of AI for your professional and personal areas.",
        "explanation": "Skills you have: x,y,z. Skills you will get: w, z, t.",
        "new_skills": ["model_evaluation", "ideation"],
        "existing_skills": ["language_models","neural_networks"],
        "interests": ["data_science", "natural_language_processing"],
        "score": 10.4,
        "normalized_score": 0.8,
        "language": "English",
        "organization": "Sample University",
        "duration": "8 hours",
        "price": "€ 10"
    }
];

const sampleRules = {
    "visuals": [
        {
            type: "Courses",
            data: courses,
            title: "Course Recommendations",
            buttonTitle: "Courses",
            properties: { fontSize: 14 , fontFamily: 'serif' }
        },{
            type: "HexagonMap",
            data: digitalTwinJson,
            properties: { fontSize: 15, figSize:60,'backgroundColor':'gray'},
            title: "Skills Profile",
            buttonTitle: "Skills",
        },{
            type: "Jobs",
            data: jobs,
            title: "Job Recommendations",
            buttonTitle: "Jobs",
            properties: { fontFamily: 'sans-serif' }
        }
    ],

    "properties" : {
        fontSize: 16,
        fontFamily: "Arial",
        backgroundColor:'white',
        inactiveColor: "#08233A",
        activeColor: "#11A1F2",
    },
}

module.exports = { sampleRules };