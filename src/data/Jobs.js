import jobHeadai from "./job_providers/headai.job";

function process(data, provider){
    if (provider == 'headai'){
        return jobHeadai.processCompassHeadai(data);
    }  else if (provider == 'headai_live'){
        return jobHeadai.processCompassLiveHeadai(data);
    } else {
        return null;
    }
}

function normalize(jobs){
    if (!Array.isArray(jobs)) return jobs;

    for (let i = 0; i < jobs.length; i++) {
        PropertiesUtils.normalizeProperties(jobs[i]);
    }
}

const jobs = {
    process,
    normalize,
}

export default jobs;