function initCustomLogo(plot, organization){
    const logoInfo = {
        'headai':{
            'imageUrl':'https://megatron.headai.com/lib/headai-logo-without-name-black-transparent.png',
            'subtitle': '© Headai',
        }
    }
    const info = logoInfo[organization] || {};
    initLogo(plot, info?.imageUrl, info?.subtitle);
}

function initLogo(plot, imageUrl, subtitle){
    var { outerSVG } = plot.getComponents();
    const { width , height } = plot.properties;

    const sizeImage = 80;
    const xImage = width - sizeImage;
    const yImage = height - sizeImage;

    const textHeight = 20;
    const textSize = '13px';


    const logoContainer =  outerSVG
    .selectAll('svg.logo').data([null]).enter()
    .append('svg').attr('class','logo');

    // Logo Image
    var foreignImage = logoContainer.append('foreignObject')
    .attr('class','foreignImage')
    .attr('x',0)
    .attr('y',0)
    .attr('width',sizeImage)
    .attr('height',sizeImage)
    .node();

    var imageLogo = document.createElement('img');
    imageLogo.setAttribute('width',sizeImage);
    imageLogo.setAttribute('height',sizeImage);
    imageLogo.setAttribute('src',imageUrl);
    foreignImage.appendChild(imageLogo);

    var foreignText = logoContainer.append('foreignObject')
    .attr('class','foreignText')
    .attr('x',0)
    .attr('y',sizeImage - textHeight)
    .attr('width',sizeImage)
    .attr('height',textHeight)
    .node();

    var textLogo = document.createElement('p');
    textLogo.setAttribute('width',sizeImage);
    textLogo.innerHTML = subtitle;
    textLogo.style.textAlign = 'center';
    textLogo.style.margin = 0;
    textLogo.style.fontFamily = 'sans-serif';
    textLogo.style.fontSize = textSize;
    textLogo.style.fontWeight = 'normal';
    textLogo.style.pointerEvents = 'none';
    foreignText.appendChild(textLogo);

    refreshLogo(plot);
} 

function refreshLogo(plot){
    const { outerSVG } = plot.components;
    const logoContainer =  outerSVG.selectAll('svg.logo');
    const { width , height, margin } = plot.properties;
    const sizeImage = 80;
    const xImage = width - margin.right - margin.left - sizeImage;
    const yImage = height - margin.bottom - margin.top - sizeImage;
    logoContainer.attr('x', xImage).attr('y', yImage);
}

const logo = {
    initLogo,
    initCustomLogo,
    refreshLogo,
}

module.exports = logo;