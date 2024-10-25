const Component = require("../Component");

class ListVisualizer extends Component{
    static defaultProperties = {};

    constructor(data,props){
        super(data,props);
    }

    initComponents(){
        super.initComponents();

        const { mainContainer } = this.components;

        mainContainer.selectAll('ul.listContainer').data([null]).enter().append('ul')
            .attr('class','list-group listContainer');
        
        this.components.listContainer = mainContainer.select('ul.listContainer');
    }
}

module.exports = {
    ListVisualizer
}