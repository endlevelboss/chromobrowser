var DataHandler = React.createClass({
    getInitialState: function() {
        var initValue = null;
        var selectedKit = null;
        var selectedMatch = null;
        if (kits.length > 0) {
            selectedKit = kits[0].name;
            selectedMatch = setDefaultMatch(kits[0].matches);
            initValue = kits[0].matches;
        }
        return { selection: initValue,
                 matchselection: null,
                selectedKit: selectedKit,
                selectedMatch: selectedMatch,
               }
    },
    handleChange: function(e) {
        if(e.target != null) {
            var matches = getKit(e.target.value).matches
            var selectedMatch = setDefaultMatch(matches);
            this.setState({selection: matches,
                          selectedKit: e.target.value,
                          selectedMatch: selectedMatch});
        }
    },
    clickMatch: function(e) {
        if (e.target != null) {
            var mydata = getData(this.state.selection, e.target.value);
            this.setState({matchselection: mydata,
                          selectedMatch: e.target.value});
        }
    },
    importInCommon: function(e) {
        var files = e.target.files;
        if (this.state.selectedKit != null)
            importInCommon(files[0], this.state.selectedKit, this.state.selectedMatch);
    },
    render: function() {
        return(
            <div>
                <div style={styles.dataview} >
                Kit: <br/>
                <KitSelector onChange={this.handleChange} kitlist={this.props.kits}/>
                Matches: <br/>
                <KitSelector onChange={this.clickMatch} kitlist={this.state.selection} />
                Choose In Common file to import: <br/>
                <input type="file" multiple onChange={this.importInCommon} />
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
  getInitialState: function () {
    return({
      kitlist: cm.kits,
    })
  },
  componentDidMount: function () {
    cm.registerCallback(this);
  },
  componentWillUnmount: function () {
    cm.unregisterCallback(this);
  },
  update: function () {
    this.setState({
      kitlist: cm.kits,
    })
  },
    render: function() {
        var options =null;
        if (this.state.kitlist != null) {
            options = this.state.kitlist.map( function(kit, index) {
                return <option key={kit.name} value={kit.name}>{kit.name}</option>;
            });
        }
        return(
            <form onChange={this.props.onChange}>
            <select id={this.props.id}>
            {options}
            </select >
            </form>
        );
    }
});
