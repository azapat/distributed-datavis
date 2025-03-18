modalId = 'modalElementDetail';

function formatSkill(label){
    if (typeof(label) != "string") return label;
    label = label.replaceAll('_',' ');
    label = label.replace(/(^\w{1})|(\s+\w{1})/g, letter => letter.toUpperCase());
    return label;
}

function normalizeSkill(label){
    if (typeof(label) != "string") return label;
    label = label.trim();
    label = label.toLowerCase();
    label = label.replaceAll(' ','_');
    return label;
}

const SkillsUtils = {
    formatSkill,
    normalizeSkill,
}

module.exports = SkillsUtils;