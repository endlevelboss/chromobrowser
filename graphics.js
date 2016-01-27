var Graphic = React.createClass({
    componentDidMount: function() {
    var context = this.getDOMNode().getContext('2d');
    this.paint(context);
  },

  componentDidUpdate: function() {
    var context = this.getDOMNode().getContext('2d');
    context.clearRect(0, 0, 1550, 3);
    this.paint(context);
  },

  paint: function(context) {
      var scale = (canvaswidth - 50) / chromolength[this.props.chromoIndex];
      context.save();
        context.fillStyle = 'lightGrey';
        context.fillRect(0, 0, 1550, 3);
        if (this.props.raw.length > 0) {
            for (var i=0; i<this.props.raw.length; i++) { 
                context.fillStyle = this.props.raw[i].color;
                var xpos = Number(this.props.raw[i].position) * scale;
                context.fillRect(xpos, 0, 1, 3);
            }
        }
      context.restore();
  },

  render: function() {
    return <canvas width={1550} height={3} />;
  }
});
