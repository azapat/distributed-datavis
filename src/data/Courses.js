import PropertiesUtils from "../properties/utils";

import courseFormatHeadai from './course_providers/headai.course';
import courseInokufu from "./course_providers/inokufu.course";

function process(data, provider){
    var courses = null;
    if (provider == 'inokufu'){
        courses = courseInokufu.process(data);
    } else if (provider == 'headai'){
        courses = courseFormatHeadai.processCompassHeadai(data);
    } else if (provider == 'headai_live'){
        courses = courseFormatHeadai.processCompassLiveHeadai(data);
    }
    return courses;
}

function normalize(courses){
    if (!Array.isArray(courses)) return courses;

    for (let i = 0; i < courses.length; i++) {
        PropertiesUtils.normalizeProperties(courses[i]);
    }
}

const courses = {
    process,
    normalize,
}

export default courses;