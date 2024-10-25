modalId = 'modalElementDetail';

function formatSkill(label){
    if (typeof(label) != "string") return label;
    label = label.replaceAll('_',' ');
    label = label.replace(/(^\w{1})|(\s+\w{1})/g, letter => letter.toUpperCase());
    return label;
}

const SkillsUtils = {
    formatSkill,
}

module.exports = SkillsUtils;