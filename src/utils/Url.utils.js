function normalizeParamName(str){
    return str.replace(/([_]\w)/g, match => match[1].toUpperCase());
}

function getParamsFromUrl(){
    var params = new URLSearchParams(window.location.search);
    var newParams = {};

    for (var [key, value] of params.entries()){
        key = normalizeParamName(key);
        newParams[key] = value;
    }

    normalizeParameters(newParams);

    return newParams;
}

/**
 * Preprocesses the parameters from the URL and Normalizes their naming.
 * The operations are performed over the given dictionary
 * @param {*} params 
 */
function normalizeParameters(params){
    if (params == null) return;
    var { clickAction , wordType , onlyNearestNeighbors } = params;

    // Normalize click_action (retrocompatibility)
    if (typeof(clickAction) == 'string') {
        params['actionOnClick'] = params['clickAction'];
        delete params['clickAction'];
    }

    // Normalize wordType (retrocompatibility)
    wordType = simplifyString(wordType);
    if (wordType == 'onlycompounds' || wordType == 'onlycompound'){
        params['onlyCompounds'] = true;
        delete params['wordType'];
    }
}

// Simplifies structure of a string to support multiple variations of the same value
function simplifyString(value){
    if (typeof(value) != "string") return null;
    value = value.replaceAll('_','');
    value = value.replaceAll(' ','');
    value = value.toLowerCase();
    return value;
}

const UrlUtils = {
    getParamsFromUrl,
};

module.exports = UrlUtils;