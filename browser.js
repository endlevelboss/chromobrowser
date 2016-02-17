//var selectedChromosome = '1'; // testvariabel
var selectedLimit = '5';

var canvasheight = 600;
var canvaswidth = 1600;

//var numOfRows = 1;
//var rownumber = 0;
var yoffset = 40;

var BrowserHandler = React.createClass({
    getInitialState: function () {
      return({
        selectedMatch: cm.selectedMatch,
       });
    },
    componentDidMount: function () {
      cm.registerCallback(this);
    },
    componentWillUnmount: function () {
      cm.unregisterCallback(this);
    },
    setChromosome: function(e) {
        if (e.target != null) {
          cm.setChromosome(e.target.value, e.target.selectedIndex);
        }
    },
    selectDisplay: function(e) {
        if (e.target != null) {
          cm.setDisplay(e.target.value);
        }
    },
    kitSelection: function(e) {
      if (e.target != null) {
        cm.setKit(e.target.id, e.target.value);
      }
    },
    useParentCheckbox: function(e) {
      if (e.target != null) {
        cm.setParentCheckbox(e.target.checked);
      }
    },
    update: function() {
      this.setState({
        selectedMatch: cm.selectedMatch,
      });
    },
    render: function() {
        var matchinfo = null;
        if (this.state.selectedMatch != null) {
            matchinfo = <MatchInfo matchname={this.state.selectedMatch} />
        }
        return(
            <div style={styles.main} >

            <ChromoSelector  onChange={this.setChromosome} />
            <form style={styles.displayselect} onChange={this.selectDisplay}>
                <select>
                    <option value='A'>Single kit</option>
                    <option value='B'>Compare two kits, in common</option>
                    <option value='E'>Compare two kits, not in common</option>
                    <option value='C'>Compare two kits</option>
                    <option value='D'>Compare three kits, in common</option>

                </select>
            </form>
            <form>
            <input type={'checkbox'} onChange={this.useParentCheckbox} />
            </form>
            <KitSelector id={1} onChange={this.kitSelection}/>
            <KitSelector id={2} onChange={this.kitSelection}/>
            <KitSelector id={3} onChange={this.kitSelection}/>
            <Display />
            {matchinfo}
            </div>
        );
    }
});

var MatchInfo = React.createClass({
    change: function(e) {
        cm.setAncestry(this.props.matchname, e.target.value);
        //this.props.update();
    },
    render: function() {
        var relations = getRelations();
        var relSelect = null;
        if (relations != null) {
            var relSelect = relations.map( function(relation) {
                    return (
                        <option key={relation.name} value={relation.name}>{relation.name}</option>
                    );
            });
        }

        return (
            <div style={styles.matchinfo}>
            {this.props.matchname}
            <form>
            <select value={'a'} onChange={this.change}>
            <option value={'a'} disabled>Select assumed ancestry:</option>
            {relSelect}
            </select>
            </form>
            </div>
        );
    }
});

var Display = React.createClass({
  getInitialState: function () {
    return({
      data: cm.matchdata,
      incommon: cm.inCommonWithSelectedMatch,
      users: cm.currentUsers,
      compare: cm.comparisons,
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
      data: cm.matchdata,
      incommon: cm.inCommonWithSelectedMatch,
      users: cm.currentUsers,
      compare: cm.comparisons,
    })
  },
  render: function() {
       var length = this.state.data.length;
       var matchblocks = [];
       for (var i = 0; i< length; i++){
            matchblocks[i] = <MatchBlocks key={i} matchdata={this.state.data[i]} rows={length} rownumber={i} incommon={this.state.incommon} user={this.state.users[i]} />
        }

       var compared = [];
       for (var i=0; i < this.state.compare.length; i++) {
           compared[i] = <ComparedKits key={i} data={this.state.compare[i][0]} rows={length} rownumber={this.state.compare[i][2]} raw={this.state.compare[i][1]} />
       }
       return(
           <div>
            <DisplayWithMarker matchblocks={matchblocks} compared={compared} />
           </div>
       );
   }
});

var DisplayWithMarker = React.createClass({
    getInitialState: function() {
        return {
                marker: null,
                dragging: false,
               }
    },
    onClick: function(e) {
        if (e.button !== 0) return;
        cm.setSelectedMatch(null);
        if (this.state.dragging == false) {
            this.setState({
                dragging: true,
                matchSelect: null,
            });
            document.addEventListener('mousemove', this.onMouseMove);
        } else {
            this.setState({
               dragging: false,
            });
            document.removeEventListener('mousemove', this.onMouseMove);
        }
        e.stopPropagation();
    },
    onMouseMove: function(e) {
        var xpos = e.pageX;
        var mystyle = {
            position: 'absolute',
            top: '25px',
            left: xpos + 'px',
            height: '550px',
            width: '2px',
            backgroundColor: 'black',
            zIndex: '200',
        };
        var mymarker = <div style={mystyle} />
        this.setState({
            marker: mymarker,
        });
        e.stopPropagation();
    },
    render: function() {
        return(
           <div onClick={this.onClick} >
           {this.props.matchblocks}
           {this.props.compared}

            {this.state.marker}
           </div>
       );
    }
});



var ChromoSelector = React.createClass({
    render: function() {
        return(
            <form style={styles.chromoselect} onChange={this.props.onChange}><select>
            <option key='1' value='1'>1</option>
            <option key='2' value='2'>2</option>
            <option key='3' value='3'>3</option>
            <option key='4' value='4'>4</option>
            <option key='5' value='5'>5</option>
            <option key='6' value='6'>6</option>
            <option key='7' value='7'>7</option>
            <option key='8' value='8'>8</option>
            <option key='9' value='9'>9</option>
            <option key='10' value='10'>10</option>
            <option key='11' value='11'>11</option>
            <option key='12' value='12'>12</option>
            <option key='13' value='13'>13</option>
            <option key='14' value='14'>14</option>
            <option key='15' value='15'>15</option>
            <option key='16' value='16'>16</option>
            <option key='17' value='17'>17</option>
            <option key='18' value='18'>18</option>
            <option key='19' value='19'>19</option>
            <option key='20' value='20'>20</option>
            <option key='21' value='21'>21</option>
            <option key='22' value='22'>22</option>
            <option key='X' value='X'>X</option>
            </select>
            </form>
        );
    }
});

var MatchBlocks = React.createClass({
  getInitialState: function () {
    return({
      useParent: cm.useParentCheckbox,
      chromoIndex: cm.selectedChromoIndex,
      chromosome: cm.selectedChromosome,
      incommon: cm.inCommonWithSelectedMatch,
    });
  },
  componentDidMount: function () {
    cm.registerCallback(this);
  },
  componentWillUnmount: function () {
    cm.unregisterCallback(this);
  },
  update: function () {
    this.setState({
      useParent: cm.useParentCheckbox,
      chromoIndex: cm.selectedChromoIndex,
      chromosome: cm.selectedChromosome,
      incommon: cm.inCommonWithSelectedMatch,
    });
  },
    render: function() {
        var content = null;
        if (this.props.matchdata.length > 0) {
          var clist = checkColumnList(this.props.matchdata, this.state.useParent, this.props.user.name);
          var chromosome = this.state.chromoIndex;
          var rows = this.props.rows;
          var rownumber = this.props.rownumber;
          if (this.props.matchdata != null) {
              content = this.props.matchdata.map( function(data) {
                  return( <MatchBlock key={data.match + data.chromo + data.start} chromoIndex={chromosome} matchdata={data} columnlist={clist} rows={rows} rownumber={rownumber} incommon={this.state.incommon}/>
                        );
                         }.bind(this)
            );
          }
      }
        return (
            <div>
            <Chromosome chromosome={this.state.chromosome} list={clist} chromoIndex={this.state.chromoIndex} rows={this.props.rows} rownumber={this.props.rownumber} useParent={this.props.useParent} />
            {content}
            </div>
               );
    }
});

var AssumedAncestryOverlay = React.createClass({
    render: function() {
        var columns = 0;
        var numOfRows = this.props.rows;
        for (var colcount = 0; colcount < this.props.list.length; colcount++) {
            columns = columns + this.props.list[colcount];
        }

        var rowheight = (canvasheight - 50 - 6 * (numOfRows - 1)) / numOfRows;
        var yscale = (canvasheight - 50 - 6 * (numOfRows - 1)) / (columns * numOfRows);
        var rectWidth = canvaswidth;
        var rectHeight = yscale * this.props.list[0];
        var xpos = 0;
        var ypos = 0;
        var dadstyle = overlaystyle(xpos, ypos, rectHeight, rectWidth, 10, '#407dbf', 'lightblue');
        ypos = rectHeight;
        rectHeight = yscale * this.props.list[1];
        var mumstyle = overlaystyle(xpos, ypos, rectHeight, rectWidth, 10, '#ff8080', 'red');
        return (
            <div>
            <div style={dadstyle}></div>
            <div style={mumstyle}></div>
            </div>
        );
    }

});

// MatchBlock key={data.match + data.chromo + data.start} chromoIndex={chromosome} matchdata={data} columnlist={clist} rows={rows}
//     rownumber={rownumber} incommon={this.state.incommon}/>


var MatchBlock = React.createClass({
  getInitialState: function () {
      return({
        mycolor: getRelationColor(this.props.matchdata.match),
      });
  },
  componentDidMount: function () {
    cm.registerCallback(this);
  },
  componentWillUnmount: function () {
    cm.unregisterCallback(this);
  },
  update: function () {
    this.setState({
      mycolor: getRelationColor(this.props.matchdata.match),
    });
  },
  onClick: function (e) {
    cm.setSelectedMatch(this.props.matchdata.match);
    e.stopPropagation();
  },
    render: function() {
        var columns = 0;
        var numOfRows = this.props.rows;
        for (var colcount = 0; colcount < this.props.columnlist.length; colcount++) {
            columns = columns + this.props.columnlist[colcount];
        }

        var rowheight = (canvasheight - 50 - 6 * (numOfRows - 1)) / numOfRows;
        var yscale = (canvasheight - 50 - 6 * (numOfRows - 1)) / (columns * numOfRows);
        var scale = (canvaswidth - 50) / chromolength[this.props.chromoIndex];

        var parentadjustment = 0;
        for (var i = 0; i < this.props.matchdata.bigcolumn; i++) {
            parentadjustment += this.props.columnlist[i] * yscale;
        }

        var xpos = Number(this.props.matchdata.start) * scale + 50;
        var ypos = yscale * this.props.matchdata.column + 25 + (rowheight + 6) * this.props.rownumber + parentadjustment;

        var rectWidth = (this.props.matchdata.end - this.props.matchdata.start) * scale - 2;
        var rectHeight = yscale - 2;

        // var mycolor = getRelationColor(this.props.matchdata.match);
        if (this.props.incommon.indexOf(this.props.matchdata.match) > -1) {
            var kitnames = kits.map(function(kit){ return kit.name; });
            if (kitnames.indexOf(this.props.matchdata.match) < 0) {
                mycolor = 'lightgreen';
            }
        }

        var matchblockStyle = matchstyle(xpos, ypos, rectHeight, rectWidth, this.state.mycolor);
        return(
            <div style={matchblockStyle} value={this.props.matchdata.match} onClick={this.onClick}>
            <label className={'unselectable'} value={this.props.matchdata.match} onClick={this.onClick}>{this.props.matchdata.match}</label>
            </div>
        );
    }
});

// <ComparedKits key={i} data={this.state.compare[i][0]} rows={length} rownumber={this.state.compare[i][2]} raw={this.state.compare[i][1]} />

var ComparedKits = React.createClass({
  getInitialState: function () {
    return({
      chromoIndex: cm.selectedChromoIndex,
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
      chromoIndex: cm.selectedChromoIndex,
    });

  },
    render: function() {
        var numOfRows = this.props.rows;
        var scale = (canvaswidth - 50) / chromolength[this.state.chromoIndex];
        var rectHeight = (canvasheight - 50 - 6 * (numOfRows - 1)) / numOfRows;
        var xpos = 50;
        var ypos = 25 + rectHeight + (rectHeight + 6) * this.props.rownumber;
        var myHeight = 6;
        var myWidth = canvaswidth - 50;
        var mystyle = {
            position: 'absolute',
            top: ypos,
            left: xpos,
            backgroundColor: '#c10000',
            height: myHeight,
            width: myWidth,
            padding: '0px',
            margin: '0px',
            overflow: 'hidden',
        };
        var rawstyle = {
            position: 'absolute',
            top: ypos,
            left: xpos,
            backgroundColor: '#c10000',
            height: 3,
            width: myWidth,
            padding: '0px',
            margin: '0px',
            overflow: 'hidden',
        };
        var rawDisplay = null;
        if (this.props.raw != null && this.props.raw.length > 0) {
            rawDisplay = (
                <div style={rawstyle}>
            <Graphic raw={this.props.raw} chromoIndex={this.state.chromoIndex} />
            </div>
            )
        }
        if (this.props.data != null) {
            content = this.props.data.map( function(d) {
                var blockxpos = d.start * scale;
                var blockwidth = (d.end - d.start) * scale;
                var blockstyle = {
                    position: 'absolute',
                    top: 0,
                    left: blockxpos,
                    backgroundColor: '#f0f81d',
                    height: 6,
                    width: blockwidth,
                    padding: '0px',
                    margin: '0px',
                    overflow: 'hidden',
                };
                return( <div key={d.match + d.chromo + d.start} style={blockstyle} />
                      );
                       }
                                              );
        }
        return (
            <div>
            <div style={mystyle}>
            {content}
            </div>
            {rawDisplay}
            </div>
        );
    }
});



var Chromosome = React.createClass({
  getInitialState: function () {
    return({
      useParent: cm.useParentCheckbox,
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
      useParent: cm.useParentCheckbox,
    });
  },
    render: function() {
        var numOfRows = this.props.rows;
        var scale = (canvaswidth - 50) / chromolength[this.props.chromoIndex];
        var rectHeight = (canvasheight - 50 - 6 * (numOfRows - 1)) / numOfRows;
        var rectWidth = canvaswidth;
        var fSize = (rectHeight -20) + 'px';

        var xpos = 25;
        var ypos = 25 + (rectHeight + 6) * this.props.rownumber;

        var cstyle = chromostyle(xpos, ypos, rectHeight, rectWidth, fSize);

        var xposCentro = xpos + centrostart[this.props.chromoIndex] * scale;
        var widthCentro = (centroend[this.props.chromoIndex] - centrostart[this.props.chromoIndex]) * scale;
        var centrostyle = {
            position: 'absolute',
            top: 0,
            left: xposCentro,
            backgroundColor: '#9f9f9f',
            height: rectHeight,
            width: widthCentro,
            padding: '0px',
            margin: '0px',
            overflow: 'hidden',
        };


        var overlay = null;
        if (this.state.useParent) {
            overlay = <AssumedAncestryOverlay list={this.props.list} rows={this.props.rows} rownumber={this.props.rownumber} />
        }

        return(
            <div style={cstyle} >
            {overlay}
            <div style={centrostyle}  />
            {this.props.chromosome}
            </div>
        );
    }
});
