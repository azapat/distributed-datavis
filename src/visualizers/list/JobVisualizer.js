const { ListVisualizer } = require("./ListVisualizer");

import './JobVisualizer.css';
import './ListVisualizer.css';

import * as bootstrap from 'bootstrap';
import SkillsUtils from '../../data/skills.utils';
import courses from '../../data/Courses';
import PropertiesUtils from '../../properties/utils';

export class JobVisualizer extends ListVisualizer {
    static defaultProperties = {
        width: 1000,
        lengthShortDescription: 450,
    }

    static rulesProperties = {
        'lengthShortDescription':{
            type: 'number',
        }
    }

    constructor(props){
        super(props);
        this.#initModal();
    }

    #initModal(){
        const { mainContainer } = this.getComponents();
        const This = this;
        
        // Modal
        const modalDiv = mainContainer.selectAll(`div.modal`)
        .data([null]).enter().append('div')
        .attr('class','modal fade')
        .attr('tabindex','-1').attr('aria-hidden',true);

        const modalContainer = modalDiv.append('div').attr('class','modal-dialog modal-lg').attr('role','document')
        .append('div').attr('class','modal-content');

        const modalHeader = modalContainer.append('div').attr('class','modal-header');
        const modalTitle = modalHeader.append('h5').attr('class','modal-title').text('Modal Title');
        modalHeader.append('button').attr('type','button').attr('class','btn-close').on('click',()=>This.hideModal());

        const modalContent = modalContainer.append('div').attr('class','scrolling content')
        .append('div').attr('class','description').attr('class','modal-description')
        .style('padding','1.5rem');

        const modalDescription = modalContent.append('div').attr('class','modalDescription');
        const modalDetails = modalContent.append('div').attr('class','modalDetails');

        // Existing Skills
        const modalmatchingSkillsContainer = modalContent.append('div').attr('class','modalmatchingSkillsContainer');
        modalmatchingSkillsContainer.append('div').attr('class','sectionDivider') // Separator
        modalmatchingSkillsContainer.append('div').attr('class','sectionTitle').text('Matching Skills');
        const modalmatchingSkills = modalmatchingSkillsContainer.append('div').attr('class','modalmatchingSkills');

        // Missing Skills
        const modalmissingSkillsContainer = modalContent.append('div').attr('class','modalmissingSkillsContainer');
        modalmissingSkillsContainer.append('div').attr('class','sectionDivider') // Separator
        modalmissingSkillsContainer.append('div').attr('class','sectionTitle').text('Missing Skills');
        const modalmissingSkills = modalmissingSkillsContainer.append('div').attr('class','modalmissingSkills');

        // Buttons
        modalContent.append('br')
        const modalFooter = modalContent.append('div').attr('class','modal-footer modalButtons');

        // Button - Read Mode
        const readMoreButton = modalFooter.append('a').attr('class','btn btn-primary readMoreButton')
        .text('Read more').attr('target','_blank').attr('rel','noreferrer');

        this.components = {
            ...this.components,
            modalDiv, modalContainer, modalTitle, modalFooter, modalDescription, modalmissingSkills, modalmatchingSkills, readMoreButton,
            modalDetails,
        }
    }

    showModal(data){
        var {
            url, title, description, missingSkills, matchingSkills,
        } = data;

        matchingSkills = PropertiesUtils.normalizePropertyValue('array', matchingSkills);
        missingSkills = PropertiesUtils.normalizePropertyValue('array', missingSkills);

        const {
            modalDiv,
            modalContainer,
            modalTitle,
            modalFooter,
            modalDescription,
            modalmissingSkills,
            modalmatchingSkills,
            readMoreButton,
            modalDetails,
        } = this.getComponents();

        modalTitle.text(title);
        modalDescription.text(description);

        /////// See list of key-values
        const detailFields = ['author','language','time','score','normalizedScore','location'];
        const details = [];
        for (let i = 0; i < detailFields.length; i++) {
            const field = detailFields[i];
            const value = data[field];
            if (value == null) continue;
            if (typeof(value) === 'string' && value.trim() == '') continue;
            const title = PropertiesUtils.propertyNameToTitle(field);
            details.push({key:title, value: value})
        }

        // Details
        modalDetails.selectAll('*').remove();
        modalDetails.append('br');
        modalDetails.selectAll('p').data(details).enter().append('p').html(
            d => `<strong>${d.key}:</strong> ${d.value}`
        );
        //////////////////////////////////

        modalmissingSkills.selectAll('button.missingSkill').remove();
        modalmatchingSkills.selectAll('button.matchingSkill').remove();

        const visibilitymissingSkills = (!Array.isArray(missingSkills) || missingSkills.length == 0) ? 'none' : 'unset';
        modalContainer.selectAll('.modalmissingSkillsContainer').style('display',visibilitymissingSkills);

        const buttonsmissingSkills = modalmissingSkills.selectAll('button.missingSkill').data(missingSkills).enter()
        .append('button').attr('class','missingSkill btn')
        .attr('type','button')
        // TODO: Format Skill Label Correctly
        .text(d => SkillsUtils.formatSkill(d));

        const visibilitymatchingSkills = (!Array.isArray(matchingSkills) || matchingSkills.length == 0) ? 'none' : 'unset';
        modalContainer.selectAll('.modalmatchingSkillsContainer').style('display',visibilitymatchingSkills);

        const buttonsmatchingSkills = modalmatchingSkills.selectAll('button.matchingSkill').data(matchingSkills).enter()
        .append('button').attr('class','matchingSkill btn')
        .attr('type','button')
        // TODO: Format Skill Label Correctly
        .text(d => SkillsUtils.formatSkill(d));

        // Refresh URL of Read More Button
        readMoreButton.attr('href', url);

        var myModal = new bootstrap.Modal(modalDiv.node());

        myModal.show();
    }

    hideModal(){
        const { modalDiv } = this.components;
        modalDiv.classed('show',false)
        .classed('hide',true).style('display','none');

        d3.select('body').classed('modal-open',false)
        .style('overflow',undefined).style('padding-right',undefined);

        d3.select('div.modal-backdrop').remove()
    }

    draw(data){
        // Normalizes attribute names to camelCase
        courses.normalize(data);
        super.draw(data);
        
        const {
            fontFamily,
        } = this.getProperties();

        this.setData(data);
        const { listContainer , mainContainer } = this.getComponents();

        mainContainer.selectAll('ul.listContainer').data([null]).join(
            enter => {},
            update => update.style('font-family',fontFamily),
            exit => exit.remove(),
        );

        listContainer.selectAll('li.listElement').data(data).join(
            enter => this.initializeJobs(enter),
            update => this.drawCourses(update),
            exit => exit.remove(),
        );

        this.reattach();
        return this.components.mainSvg;
    }

    initializeJobs(selection){
        const listElements = selection.append('li')
            .attr('class','listElement list-group-item list-group-item-action flex-column align-items-start')
            .attr('href','#')
            .style('cursor','pointer');

        // Title
        listElements.append('h5').attr('class','header listElementTitle');

        // Description
        listElements.append('p').attr('class','listElementDescription');

        // Container of new and existing skills
        listElements.append('div').attr('class','meta listElementNumberLine');

        this.drawCourses(listElements);
    }

    drawCourses(selection){
        const {
            fontFamily, lengthShortDescription
        } = this.getProperties();

        selection.on('click', (event,data)=> this.showModal(data));

        const title = selection.select('h5.header.listElementTitle');
        title.text( d => d.title);

        const description = selection.select('p.listElementDescription');
        description.text(d => {
            var desc = d.description || '';
            var shortText = desc.substring(0,lengthShortDescription);
            if (shortText.length == lengthShortDescription) shortText += '...';
            return shortText;
        });

        const lineStats = selection.select('div.meta.listElementNumberLine');

        const showSkillBookmark = (d) => (
            (Array.isArray(d.missingSkills) && d.missingSkills.length > 0) ||
            (Array.isArray(d.matchingSkills) && d.matchingSkills.length > 0)
        )

        // Existing Skills - Label and Icon
        lineStats.filter(showSkillBookmark)
            .selectAll('span.matchingSkills').data(d=>[d]).enter()
            .append('span')
            .classed('matchingSkills', true)
            .append('i')
            .attr('class','fa fa-check matchingSkills')
            .append('line');

        // Refresh Content
        lineStats.select('span.matchingSkills i line').text(
            d => d.matchingSkills.length + ' matching Skills'
        ).style('font-family',fontFamily);

        // Remove if refreshed data doesn't skills information
        lineStats.filter((d)=>!showSkillBookmark(d)).select('span.matchingSkills').remove();


        // Missing Skills - Label and Icon
        lineStats.filter(showSkillBookmark)
            .selectAll('span.missingSkills').data(d=>[d]).enter()
            .append('span')
            .classed('missingSkills', true)
            .append('i')
            .attr('class','fa fa-times missingSkills')
            .append('line');

        // Refresh Content
        lineStats.select('span.missingSkills i line').text(
            d => d.missingSkills.length + ' missing Skills'
        ).style('font-family',fontFamily);

        // Remove if refreshed data doesn't skills information
        lineStats.filter((d)=>!showSkillBookmark(d)).select('span.missingSkills').remove();

    }
}
