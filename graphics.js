var Graphic = React.createClass({
  getInitialState: function () {
    return({
      scale: cm.scale,
      width: cm.canvaswidth,
      height: cm.comparisonHeight / 2,
    });
  },
  componentWillUnmount: function () {
    cm.unregisterCallback(this);
  },
  update: function () {
    this.setState({
      scale: cm.scale,
    });
  },
    componentDidMount: function() {
      cm.registerCallback(this);
    var context = this.getDOMNode().getContext('2d');
    this.paint(context);
  },

  componentDidUpdate: function() {
    var context = this.getDOMNode().getContext('2d');
    context.clearRect(0, 0, this.state.width, this.state.height);
    this.paint(context);
  },

  paint: function(context) {
      context.save();
        context.fillStyle = 'lightGrey';
        context.fillRect(0, 0, this.state.width, this.state.height);
        if (this.props.raw.length > 0) {
            for (var i=0; i<this.props.raw.length; i++) {
                context.fillStyle = this.props.raw[i].color;
                var xpos = Number(this.props.raw[i].position) * this.state.scale;
                context.fillRect(xpos, 0, 1, this.state.height);
            }
        }
      context.restore();
  },

  render: function() {
    return <canvas width={this.state.width} height={this.state.height} />;
  }
});
