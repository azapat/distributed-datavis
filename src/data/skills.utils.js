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

function toUnderscoreCase(label){
    if (typeof(label) != "string") return label;
    label = label.trim();
    label = label.replace(/([a-z0-9])([A-Z])/g, '$1_$2')  // camelCase → camel_Case
    label = label.toLowerCase();
    label = label.replaceAll(' ','_');
    return label;
}

function toCamelCase(label){
    if (typeof(label) != "string") return label;
    return label
        .toLowerCase()
        .replace(/[-_\s]+(.)?/g, (_, chr) => chr ? chr.toUpperCase() : '')
        .replace(/^[A-Z]/, (chr) => chr.toLowerCase());
}


const SkillsUtils = {
    formatSkill,
    normalizeSkill,
    toUnderscoreCase,
    toCamelCase,
}

module.exports = SkillsUtils;