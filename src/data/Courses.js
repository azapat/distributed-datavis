function process(data, provider){
    if (provider == 'inokufu'){
        return processInokufu(data);
    } else if (provider == 'headai'){
        return processCompassHeadai(data);
    } else {
        return null;
    }
}

function processCompassHeadai(data){
    const processed = [];

    const keys = [
        'recommendations_based_on_extensive_skills',
        'recommendations_based_on_match',
        'recommendations_based_on_learning_paths',
        'recommendations_based_on_skills_demand'
    ];

    keys.forEach(key => {
        const courses = data[key];
        if (!Array.isArray(courses)) return;
        for (let i = 0; i < courses.length; i++) {
            const course = courses[i];
            const { 
                code , url, title, short_description, explanation, new_skills, existing_skills,
                interests, quality_index, scoring_index,
            } = course;
            const newCourse = {
                url, title, new_skills, existing_skills,
                id:code,
                description: short_description,
            }
            processed.push(newCourse);
        }
    });

    return processed;
}

function processInokufu(data){
    if (!Array.isArray(data)) return null;
    const processed = [];
    
    for (let i = 0; i < data.length; i++) {
        const course = data[i];
        const { 
            id , title , url , description, score , lang , provider , price
        } = course;
        const newCourse = {
            url, title, id, description,
        }
        processed.push(newCourse);
    }
    return processed;
}

const courses = {
    process,
}

module.exports = courses;