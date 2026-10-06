function processCompassHeadai(data){
    const processed = [];

    const keys = [
        'recommendations_based_on_extensive_skills',
        'recommendations_based_on_match',
        'recommendations_based_on_learning_paths',
        'recommendations_based_on_skills_demand',
        'recommendations_based_on_matching_skills'
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
                code,
                url,
                title,
                description: short_description,
                explanation,
                newSkills: new_skills,
                existingSkills: existing_skills,
                interests,
                score: scoring_index,
                normalizedScore: quality_index,
                language: null,
                organization: null,
                duration: null,
                price: null,
            }
            processed.push(newCourse);
        }
    });

    return processed;
}

function processCompassLiveHeadai(data){
    const processed = [];

    const keys = [
        'matches'
    ];

    keys.forEach(key => {
        const courses = data[key];
        if (!Array.isArray(courses)) return;
        for (let i = 0; i < courses.length; i++) {
            const course = courses[i];
            const {
                id, score, found = [], missing = [], text_snippet,
            } = course;
            const newCourse = {
                code: String(id),
                url: '',
                title: String(id),
                description: text_snippet,
                explanation: '',
                newSkills: missing,
                existingSkills: found,
                interests: [],
                score: found.length,
                normalizedScore: score * 5,
                language: null,
                organization: null,
                duration: null,
                price: null,
            }
            processed.push(newCourse);
        }
    });

    return processed;
}

const courseHeadai = {
    processCompassHeadai,
    processCompassLiveHeadai,
};

export default courseHeadai;