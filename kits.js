var DataHandler = React.createClass({
    getInitialState: function() {
        var initValue = null;
        if (kits.length > 0)
            initValue = kits[0].matches;
        return { selection: initValue,
                 matchselection: null,
               }
    },
    handleChange: function(e) {
        if(e.target != null) {
            this.setState({selection: getKit(e.target.value).matches});
        }
    },
    clickMatch: function(e) {
        var mydata = getData(this.state.selection, e.target.value);
        this.setState({matchselection: mydata});
    },
    render: function() {
        return(
            <div>
                <div style={styles.dataview} >
                Kit: <br/>
                <KitSelector onChange={this.handleChange} kitlist={this.props.kits}/>
                </div>
                <div style={styles.datatext}>
                Matches: <br/>
                <KitSelector onChange={this.clickMatch} kitlist={this.state.selection} />
                </div>
                <div style={styles.datainfobox}>
                <DataDisplay data={this.state.matchselection} />
                </div>
            </div>
        );
    }
});

var DataLine = React.createClass({
    render: function() {
        return (
            <tr><td>Ch: {this.props.data.chromo}</td><td>Length: {this.props.data.lngth} cM</td></tr>
        );
    }
});

var DataDisplay = React.createClass({
    render: function() {
        var content = null;
//        console.log(this.props.data);
        if (this.props.data != null) {
            content = this.props.data.map( function(datablock, index) {
                return <DataLine data={datablock} key={index} />
            });
        }
        return (
            <table>{content}</table>
        );
    }
});

var KitSelector = React.createClass({
    render: function() {
        var options = this.props.kitlist.map( function(kit, index) {
            return <option key={kit.name} value={kit.name}>{kit.name}</option>;
        });
        return(
            <form onChange={this.props.onChange}>
            <select>
            {options}
            </select >
            </form>
        );
    }
});

