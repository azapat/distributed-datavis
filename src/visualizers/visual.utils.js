function getSplittedText(text, width, textObject) {
    const splittedText = [];
    var originalWords = text.split(/\s+/).reverse();
    var words = [];
    originalWords.forEach(d => words.push(d.charAt(0).toUpperCase() + d.slice(1)));
    var word = null;
    var line = [];
    var tspan = textObject.append("tspan")
        .attr("dy", 0 + "em")
        .attr('id', '_TEMPORAL');
    while (word = words.pop()) {
        line.push(word);
        tspan.text(line.join(" "));
        if (getComputedTextLength(tspan) > width) {
            if (line.length > 1) {
                line.pop();
                splittedText.push(line.join(' '));
                line = [word];
                tspan.text('');
            }
            if (getComputedTextLength(tspan) > width && line.length === 1) {   // Only one word
                var length = word.length;
                var i = length - 1;
                line.pop();
                do {
                    var subWord = line.join(' ') + ' ' + word.substring(0, i) + '-';
                    var remain = word.substring(i, length);
                    tspan.text(subWord);
                    i--;
                } while (getComputedTextLength(tspan) > width && i > 0);
                words.push(remain);
                splittedText.push(subWord);
                line = [];
                tspan.text('');
            }
        }
    }
    if (line.length > 0) {
        splittedText.push(line.join(' '));
    }
    textObject.select('tspan#_TEMPORAL').remove();
    return splittedText;
}

function getComputedTextLength(selection){
    const text = selection.node().textContent;
    const charWidth = 7;
    return (text || "").length * charWidth;
}

function wrapLines(text, width) {
    text.each(function () {
        var text = d3.select(this);
        var originalWords = text.text().split(/\s+/).reverse();
        var words = [];
        originalWords.forEach(d => words.push(d.charAt(0).toUpperCase() + d.slice(1)));
        var word = null;
        var line = [];
        var lineHeight = 1.1; // ems
        //var y = text.attr("0%");
        var x = text.attr("x");
        if (x == null) x = '0px';
        var tspan = text.text(null).append("tspan")
            .attr("x", x)
            //.attr("y", y)
            .attr("dy", 0 + "em");
        while (word = words.pop()) {
            line.push(word);
            tspan.text(line.join(" "));
            if (getComputedTextLength(tspan) > width) {
                if (line.length > 1) {
                    line.pop();
                    tspan.text(line.join(" "));
                    line = [word];
                    tspan = text.append("tspan")
                        .attr("x", x)
                        //.attr("y", y)
                        .attr("dy", lineHeight + "em").text(word);
                }
                if (getComputedTextLength(tspan) > width && line.length === 1) {   // Only one word
                    var length = word.length;
                    var i = length - 1;
                    line.pop();
                    do {
                        var subWord = line.join(' ') + ' ' + word.substring(0, i) + '-';
                        var remain = word.substring(i, length);
                        tspan.text(subWord);
                        i--;
                    } while (getComputedTextLength(tspan) > width && i > 0);
                    words.push(remain);
                    line = [];
                    tspan = text.append("tspan")
                        .attr("x", x)
                        //.attr("y", y)
                        .attr("dy", lineHeight + "em").text('');
                }
            }
        }
    });
}

function invertColor(hex) {
    if (hex.indexOf('#') === 0) {
        hex = hex.slice(1);
    }
    if (hex.length != 6) {
        console.log("Invalid Hex Color:", hex)
        //throw new Error('Invalid HEX color.');
    }
    var r = parseInt(hex.slice(0, 2), 16),
        g = parseInt(hex.slice(2, 4), 16),
        b = parseInt(hex.slice(4, 6), 16);
    return (r * 0.299 + g * 0.587 + b * 0.114) > 170
        ? '#000000'
        : '#FFFFFF';
}

function increaseBrightness(hex, percent) {
    if (percent === 100) {
        percent = 99
    }

    hex = hex.replace(/^\s*#|\s*$/g, '');

    var r = parseInt(hex.substr(0, 2), 16),
        g = parseInt(hex.substr(2, 2), 16),
        b = parseInt(hex.substr(4, 2), 16);

    var nr = ((0 | (1 << 8) + r + (256 - r) * percent / 100).toString(16)).substr(1),
        ng = ((0 | (1 << 8) + g + (256 - g) * percent / 100).toString(16)).substr(1),
        nb = ((0 | (1 << 8) + b + (256 - b) * percent / 100).toString(16)).substr(1);

    var newHex = "#" + nr + ng + nb;
    return newHex
}

/**
 * Inserts splitted textContent inside textObject based on maxWidth
 * @param {d3 Text Selection} textObject 
 * @param {String} textContent 
 * @param {Number} fontSize 
 * @param {Number} maxWidth
 */
function readjustFontSize(textObject, textContent, fontSize, maxWidth) {
    textObject.style('font-size', fontSize + 'px').html(textContent);
    textObject.call(wrapLines, maxWidth);
}

function scaleBrightness(value, maxValue, minBright = 0, maxBright = 80) {
    var brightness = 1 - (value / maxValue);
    var percentBrightness = (brightness * (maxBright - minBright)) + minBright;
    return percentBrightness;
}

const VisualUtils = {
    increaseBrightness,
    invertColor,
    wrapLines,
    getSplittedText,
    readjustFontSize,
    scaleBrightness,
}

module.exports = VisualUtils;