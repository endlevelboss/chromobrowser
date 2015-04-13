var MainWindow = React.createClass({
    getInitialState: function() {
        return {content: <div style={styles.main}></div>};
    },
    handleButtonBrowser: function() {
        this.setState({content: <BrowserHandler kits={this.props.kits} />} );
    },
    handleButtonRelation: function() {
        this.setState({content: <RelationsHandler />} );
    },
    handleButtonData: function() {
        this.setState({content: <DataHandler kits={this.props.kits} />} );
    },
    handleButtonFile: function() {
        this.setState({content: <FileHandler />} );
    },
    render: function() {
        return(
            <div>
            <div style={styles.topmenu}>
            <button onClick={this.handleButtonBrowser}>Browser</button>
            <button onClick={this.handleButtonRelation}>Relations</button>
            <button onClick={this.handleButtonData}>Data</button>
            <button onClick={this.handleButtonFile}>File</button>
            </div>
            {this.state.content}
            </div>
        );
    }
});
            
function redraw() {
    React.render(
        <MainWindow kits={kits} />, document.getElementById('main')
    )
};

redraw();