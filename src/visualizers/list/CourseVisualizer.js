const { ListVisualizer } = require("./ListVisualizer");

import './CourseVisualizer.css';

import * as $ from 'jquery';
import * as bootstrap from 'bootstrap';
import SkillsUtils from '../../data/skills.utils';
//import * as d3 from 'd3';

export class CourseVisualizer extends ListVisualizer {
    static defaultProperties = {
        width: 1000,
        lengthShortDescription: 450,
        fields: {
            description: 'description',
            title: 'title',
            newSkills: 'new_skills',
            existingSkills: 'existing_skills',
            url: 'url',
        },
    }

    static rulesProperties = {
        'fields':{
            type: 'dictionary',
        },
        'fontFamily':{
            type: 'string',
        },
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

        // New Skills
        const modalNewSkillsContainer = modalContent.append('div').attr('class','modalNewSkillsContainer');
        modalNewSkillsContainer.append('div').attr('class','sectionDivider') // Separator
        modalNewSkillsContainer.append('div').attr('class','sectionTitle').text('New Skills');
        const modalNewSkills = modalNewSkillsContainer.append('div').attr('class','modalNewSkills');

        // Existing Skills
        const modalExistingSkillsContainer = modalContent.append('div').attr('class','modalExistingSkillsContainer');
        modalExistingSkillsContainer.append('div').attr('class','sectionDivider') // Separator
        modalExistingSkillsContainer.append('div').attr('class','sectionTitle').text('Strengthened Skills');
        const modalExistingSkills = modalExistingSkillsContainer.append('div').attr('class','modalExistingSkills');

        // Buttons
        modalContent.append('br')
        const modalFooter = modalContent.append('div').attr('class','modal-footer modalButtons');

        // Button - Read Mode
        const readMoreButton = modalFooter.append('a').attr('class','btn btn-primary readMoreButton')
        .text('Read more').attr('target','_blank').attr('rel','noreferrer');

        this.components = {
            ...this.components,
            modalDiv, modalContainer, modalTitle, modalFooter, modalDescription, modalNewSkills, modalExistingSkills, readMoreButton,
        }
    }

    showModal(data){
        const { fields } = this.properties;

        const description = data[fields.description];
        const title = data[fields.title];
        const newSkills = data[fields.newSkills] || [];
        const existingSkills = data[fields.existingSkills] || [];
        const url = data[fields.url];

        const {
            modalDiv,
            modalContainer,
            modalTitle,
            modalFooter,
            modalDescription,
            modalNewSkills,
            modalExistingSkills,
            readMoreButton,
        } = this.getComponents();

        modalTitle.text(title);
        modalDescription.text(description);

        modalNewSkills.selectAll('button.newSkill').remove();
        modalExistingSkills.selectAll('button.existingSkill').remove();

        const visibilityNewSkills = (!Array.isArray(newSkills) || newSkills.length == 0) ? 'none' : 'unset';
        modalContainer.selectAll('.modalNewSkillsContainer').style('display',visibilityNewSkills);

        const buttonsNewSkills = modalNewSkills.selectAll('button.newSkill').data(newSkills).enter()
        .append('button').attr('class','newSkill btn btn-outline-primary')
        .attr('type','button')
        // TODO: Format Skill Label Correctly
        .text(d => SkillsUtils.formatSkill(d));

        const visibilityExistingSkills = (!Array.isArray(existingSkills) || existingSkills.length == 0) ? 'none' : 'unset';
        modalContainer.selectAll('.modalExistingSkillsContainer').style('display',visibilityExistingSkills);

        const buttonsExistingSkills = modalExistingSkills.selectAll('button.existingSkill').data(existingSkills).enter()
        .append('button').attr('class','existingSkill btn btn-outline-danger')
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
            enter => this.initializeCourses(enter),
            update => this.drawCourses(update),
            exit => exit.remove(),
        );

        this.reattach();
        return this.components.mainSvg;
    }

    initializeCourses(selection){
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
            fontFamily, fields, lengthShortDescription
        } = this.getProperties();

        selection.on('click', (event,data)=> this.showModal(data));

        const title = selection.select('h5.header.listElementTitle');
        title.text( d => d[fields.title]);

        const description = selection.select('p.listElementDescription');
        description.text(d => {
            var desc = d[fields.description] || '';
            var shortText = desc.substring(0,lengthShortDescription);
            if (shortText.length == lengthShortDescription) shortText += '...';
            return shortText;
        });

        const lineStats = selection.select('div.meta.listElementNumberLine');

        const showSkillBookmark = (d) => (
            (Array.isArray(d[fields.newSkills]) && d[fields.newSkills].length > 0) ||
            (Array.isArray(d[fields.existingSkills]) && d[fields.existingSkills].length > 0)
        )

        // New Skills - Label and Icon
        lineStats.filter(showSkillBookmark)
            .selectAll('span.newSkills').data(d=>[d]).enter()
            .append('span')
            .classed('newSkills', true)
            .append('i')
            .attr('class','fa fa-bookmark newSkills')
            .append('line');

        // Refresh Content
        lineStats.select('span.newSkills i line').text(
            d => d[fields.newSkills].length + ' new Skills'
        ).style('font-family',fontFamily);

        // Remove if refreshed data doesn't skills information
        lineStats.filter((d)=>!showSkillBookmark(d)).select('span.newSkills').remove();

        // Existing Skills - Label and Icon
        lineStats.filter(showSkillBookmark)
            .selectAll('span.existingSkills').data(d=>[d]).enter()
            .append('span')
            .classed('existingSkills', true)
            .append('i')
            .attr('class','fa fa-bookmark existingSkills')
            .append('line');

        // Refresh Content
        lineStats.select('span.existingSkills i line').text(
            d => d[fields.existingSkills].length + ' enhanced Skills'
        ).style('font-family',fontFamily);

        // Remove if refreshed data doesn't skills information
        lineStats.filter((d)=>!showSkillBookmark(d)).select('span.existingSkills').remove();
    }
}
