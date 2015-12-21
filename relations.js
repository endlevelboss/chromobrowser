var RelationsHandler = React.createClass({
    getInitialState: function() {
        return{
            relationDragging: false,
            isFather: true,
            child: null,
            textvalue: '',
        }
    },
    setDragging: function(param, sender, isFather) {
        this.setState( { 
            relationDragging: param,
            child: sender,
            isFather: isFather,
        }
                     );
    },
    onMouseUp: function(e) {
        if (this.state.relationDragging) {
            this.setState({relationDragging: false});
        }   
    },
    mouseOver: function(param) {
        updateRelation(this.state.child, param, this.state.isFather);
        this.setState({relationDragging: false});
    },
    deleteRelation: function() {
        updateRelation(this.state.child, '', this.state.isFather);
        var parent = this.state.isFather?'father':'mother';
    },
    update: function() {
        this.forceUpdate();
    },
    textChange: function(event) {
        this.setState({textvalue: event.target.value});
    },
    addRelation: function() {
        if (this.state.textvalue != '') {
            addRelation(this.state.textvalue);
            this.update();
        }
    },
    render: function() {
        var relations = getRelations();
        var content = null;
        var drawer = null;
        var isRelDragging = this.state.relationDragging;
        var mouseOver = this.mouseOver;
        var setDrag = this.setDragging;
        var del = this.deleteRelation;
        var update = this.update;
        if (relations != null) {
            content = relations.map( function(rel) {
                var index = relations.indexOf(rel);
                return( <Draggable myref={rel} key={rel.name} name={rel.name} xpos={rel.xpos} ypos={rel.ypos} drag={setDrag} mouseOver={mouseOver} isRelDragging={isRelDragging} update={update} deleteRelation={del} />
                      );
                       }.bind(this)
                                              );
            drawer = <Drawer relations={relations} />
        }
        var textvalue = this.state.textvalue;
        return(
            <div style={styles.main} onMouseUp={this.onMouseUp}>
            {drawer}
            <input type="text" value={textvalue} style={styles.chromoselect} onChange={this.textChange} />
            <button style={styles.displayselect} onClick={this.addRelation}>Add</button>
            {content}
            </div>
        );
    }
});

var Drawer = React.createClass({
    render: function() {
        var content = [];
        for (var i = 0; i< this.props.relations.length; i++ ) {
            var x1 = this.props.relations[i].xpos + 92 ;
            var y1 = this.props.relations[i].ypos;
            if (this.props.relations[i].father != '') {
                var father = findRelation(this.props.relations[i].father);
                var x2 = father.xpos +102;
                var y2 = father.ypos + 50;
                content[content.length] = <line key={this.props.relations[i].name + 'father' + father.name} x1={x1}  y1={y1} x2={x2} y2={y2} style={{stroke: 'rgb(0,0,0)',strokeWidth: '1'}} />
            }
        if (this.props.relations[i].mother != '') {
                var mother = findRelation(this.props.relations[i].mother);
                x1 = x1 + 20;
                var x2 = mother.xpos +102;
                var y2 = mother.ypos + 50;
                content[content.length] = <line key={this.props.relations[i].name + 'mother' + mother.name} x1={x1}  y1={y1} x2={x2} y2={y2} style={{stroke: 'rgb(0,0,0)',strokeWidth: '1'}} />
            }
        }
        return (
            <svg height={800} width={1600}>
            {content}
            </svg>
        );
    },
});

var Draggable = React.createClass({
  getInitialState: function () {
    return {
        xpos: this.props.xpos,
        ypos: this.props.ypos,
        dragging: false,
        xrel: null, 
        yrel: null,
        color: this.props.myref.color,
    }
  },
  componentDidUpdate: function (props, state) {
    if (this.state.dragging && !state.dragging) {
      document.addEventListener('mousemove', this.onMouseMove)
      document.addEventListener('mouseup', this.onMouseUp)
    } else if (!this.state.dragging && state.dragging) {
      document.removeEventListener('mousemove', this.onMouseMove)
      document.removeEventListener('mouseup', this.onMouseUp)
    }
  },
  onMouseDown: function (e) {
    if (e.button !== 0) return;
    this.setState({
      dragging: true,
        xrel: e.pageX - this.state.xpos,
        yrel: e.pageY - this.state.ypos,
    })
    e.stopPropagation()
    e.preventDefault()
  },
  onMouseUp: function (e) {
    this.setState({dragging: false})
    
    e.stopPropagation()
    e.preventDefault()
  },
  onMouseMove: function (e) {
    if (!this.state.dragging) return
    this.setState({
        xpos: e.pageX - this.state.xrel,
        ypos: e.pageY - this.state.yrel,
    })
    this.props.myref.xpos = this.state.xpos;
      this.props.myref.ypos = this.state.ypos;
      this.props.update();
    e.stopPropagation()
    e.preventDefault()
  },
    onMouseOver: function(e) {
        if (this.props.isRelDragging) {
        this.props.mouseOver(this.props.name);
        }
    },
    changeColor: function(e) {
        this.props.myref.color = e.target.value;
        this.setState({ color: e.target.value});
    },
  render: function () {
      var color = this.state.color;
      var mystyle = {
          position: 'absolute',
          left: this.state.xpos + 'px',
          top: this.state.ypos + 'px',
        cursor: 'inter',
        width: '200px',
        height: '50px',
        border: '1px solid #000000',
        backgroundColor: 'khaki',
        borderRadius: '5px',
        fontFamily: '"Arial"',
}
    return (
//        <div className={'my-draggable'} onMouseDown={this.onMouseDown} ondblclick style={{position: 'absolute', left: this.state.xpos + 'px', top: this.state.ypos + 'px'}} >
        <div onMouseDown={this.onMouseDown} ondblclick style={mystyle} >
        <ParentSelector name={this.props.name} className={'my-father'} drag={this.props.drag} isFather={true} deleteRelation={this.props.deleteRelation} />
        <ParentSelector name={this.props.name} className={'my-mother'} drag={this.props.drag} isFather={false} deleteRelation={this.props.deleteRelation}/>
        <div className={'my-child'} onMouseOver={this.onMouseOver} />
        {this.props.name}
        <input type="color" value={color} onChange={this.changeColor} /><br/>
        </div>
    )
  }
});

var ParentSelector = React.createClass({
    mouseDown: function(e) {
        this.props.drag(true, this.props.name, this.props.isFather);
        e.stopPropagation()
        e.preventDefault()
    },
    mouseUp: function(e) {
        this.props.drag(false, this.props.name, this.props.isFather);
        this.props.deleteRelation();
        e.stopPropagation()
        e.preventDefault()
    },
    render: function() {
        return(
            <div className={this.props.className} onMouseDown={this.mouseDown} onMouseUp={this.mouseUp}/>
        );
    }
});