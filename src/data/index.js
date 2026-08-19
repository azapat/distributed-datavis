import * as courses from "./Courses.js";
import * as digitalTwin from "./digitalTwin/index.js";
import * as FormatUtils from "./format.utils.js";
import jobs from "./Jobs.js";
import * as SkillsUtils from "./skills.utils.js";

const data = {
    courses,
    jobs,
    digitalTwin,
    utils: {
        skills: SkillsUtils,
        format: FormatUtils,
    },
}

export default data;