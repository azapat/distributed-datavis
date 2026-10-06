function process(data){
    if (!Array.isArray(data)) return null;
    const processed = [];
    
    for (let i = 0; i < data.length; i++) {
        const course = data[i];
        var { currency , value } = course.price || {};
        var price = null;
        if (typeof(currency) === 'string' && typeof(value) == 'number'){
            price = `${currency} ${value}`;
        }

        var { value , unit } = course.duration || {};
        var duration = null;
        if (typeof(value) === 'number' && typeof(unit) == 'string'){
            duration = `${value} ${unit}`;
        }

        const newCourse = {
            code: course.id,
            url: course.url,
            title: course.title,
            description: course.description,
            explanation: course,
            new_skills: [],
            existing_skills: [],
            interests: [],
            score: course.score,
            normalized_score: null,
            language: course.lang,
            organization: course.provider,
            duration: duration,
            price: price,
            note: course.note,
        }
        processed.push(newCourse);
    }
    return processed;
}

const courseInokufu = {
    process,
};

export default courseInokufu;