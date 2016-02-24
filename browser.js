//var selectedChromosome = '1'; // testvariabel


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
    setCMLimit: function (e) {
      cm.setCMLimit(e.target.value);
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

            <ChromoSelector  onChange={this.setChromosome} style={{position: 'fixed',top: '0px',left: '240px',}} />
            <form onChange={this.setCMLimit} style={{position: 'fixed',top: '0px',left: '290px',}}>
              <select>
                <option value={1}>1 cM</option>
                <option value={3}>3 cM</option>
                <option value={5}>5 cM</option>
                <option value={10}>10 cM</option>
              </select>
            </form>
            <form style={{position: 'fixed',top: '0px',left: '360px',}} onChange={this.selectDisplay}>
                <select>
                    <option value='A'>Single kit</option>
                    <option value='B'>Compare two kits, in common</option>
                    <option value='E'>Compare two kits, not in common</option>
                    <option value='C'>Compare two kits</option>
                    <option value='D'>Compare three kits, in common</option>

                </select>
            </form>
            <form>
            <input type={'checkbox'} onChange={this.useParentCheckbox} style={{position: 'fixed',top: '0px',left: '600px',}} />
            </form>
            <KitSelector id={1} onChange={this.kitSelection} style={{position: 'fixed',top: '0px',left: '630px',}}/>
            <KitSelector id={2} onChange={this.kitSelection} style={{position: 'fixed',top: '0px',left: '880px',}}/>
            <KitSelector id={3} onChange={this.kitSelection} style={{position: 'fixed',top: '0px',left: '1130px',}}/>
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
                dragging: false,
                height: cm.canvasheight,
                xpos: 0,
                scale: cm.scale,
               }
    },
    componentDidMount: function () {
      cm.registerCallback(this);
    },
    componentWillUnmount: function () {
      cm.unregisterCallback(this);
    },
    update: function () {
      this.setState({
        height: cm.canvasheight,
        scale: cm.scale,
      })
    },
    onClick: function(e) {
        if (e.button !== 0) return;
        cm.setSelectedMatch(null);
        if (this.state.dragging == false) {
          var pos = e.pageX;
            this.setState({
                dragging: true,
                xpos: pos,
            });
            cm.setMarkerPosition(pos);
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
        var pos = e.pageX;
        cm.setMarkerPosition(pos);
        this.setState({
          xpos: pos
        })
        e.stopPropagation();
    },
    render: function() {
      var mystyle = {
          position: 'absolute',
          top: '25px',
          left: this.state.xpos,
          height: this.state.height,
          width: '2px',
          backgroundColor: 'black',
          zIndex: '200',
      };
      var text = {
        position: 'absolute',
        top: this.state.height + 25,
        left: this.state.xpos - 20,
        width: '50px',
        color: 'black',
        fontFamily: '"Arial"',
        fontSize: 'small',
        zIndex: '200',
      };
      var mymarker = <div style={mystyle} />
      var markerpos = (this.state.xpos - cm.xoffset - cm.xinneroffset) / (this.state.scale * 1000000);
      var n = markerpos.toFixed(2);
      var mytext = <div style={text}>{n}</div>
        return(
           <div onClick={this.onClick} >
           {this.props.matchblocks}
           {this.props.compared}

            {mymarker}
            {mytext}
           </div>
       );
    }
});



var ChromoSelector = React.createClass({
    render: function() {
        return(
            <form style={this.props.style} onChange={this.props.onChange}><select>
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
    });
  },
    render: function() {
      var content = null;
      if (this.props.matchdata.length > 0) {
        var clist = checkColumnList(this.props.matchdata, this.state.useParent, this.props.user.name);
        var chromosome = this.state.chromoIndex;
        var rows = this.props.rows;
        var rownumber = this.props.rownumber;
        // var incommon = this.state.incommon;
        if (this.props.matchdata != null) {
            content = this.props.matchdata.map( function(data) {
                return( <MatchBlock key={data.match + data.chromo + data.start} chromoIndex={chromosome} matchdata={data} columnlist={clist} rows={rows} rownumber={rownumber} />
                      );
                       }.bind(this)
          );
        }
        var crossovers = [];
        if (this.state.useParent) {
          var cxFather = cm.getCrossover(this.props.user.name, true);
          var cxMother = cm.getCrossover(this.props.user.name, false);
          var name = this.props.user.name;
          cxFather.map(function (item, index) {
            var cxButton = <CrossoverButton key={index} data={item} name={name} isFather={item.father} position={item.position} list={clist} rows={rows} rownumber={rownumber}/>
            crossovers.push(cxButton);
          })
          cxMother.map(function (item, index) {
            var cxButton = <CrossoverButton key={index+'m'} data={item} name={name} isFather={item.father} position={item.position} list={clist} rows={rows} rownumber={rownumber}/>
            crossovers.push(cxButton);
          })
          // console.log(this.state.fatherCrossovers);
        }
      }
      return (
        <div>
        <Chromosome chromosome={this.state.chromosome} list={clist} chromoIndex={this.state.chromoIndex} rows={this.props.rows} rownumber={this.props.rownumber} useParent={this.props.useParent} />
        {content}
        {crossovers}
        </div>
       );
    }
});

var CrossoverButton = React.createClass({
  getInitialState: function () {
    return({
      canvasheight: cm.canvasheight,
      isDragging: false,
      toBeDeleted: false,
      position: this.props.position,
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
      canvasheight: cm.canvasheight,
    });
  },
  onMouseDown: function (e) {
    this.setState({
      isDragging: true,
      toBeDeleted: true,
    })
    e.stopPropagation();
  },
  onMouseUp: function (e) {
    e.stopPropagation();
    this.setState({
      isDragging: false,
    })
    if (this.state.position != this.props.position) {
      cm.editCrossover(this.props.data, this.state.position);
    } else {
      cm.deleteCrossover(this.props.data, this.props.name, this.props.isFather);
    }
  },
  onMouseMove: function (e) {
    if (this.state.isDragging){
      this.setState({
        position: e.pageX,
      })
    }
    e.stopPropagation();
  },
  onMouseLeave: function (e) {
    e.stopPropagation();
    this.setState({
      isDragging: false,
    })
    if (this.state.position != this.props.position) {
      cm.editCrossover(this.props.data, this.state.position);
    }
  },
  onMouseClick: function (e) {
    e.stopPropagation();
  },
  render: function () {
    var columns = 0;
    var numOfRows = this.props.rows;
    if (this.props.list != null) {
      for (var colcount = 0; colcount < this.props.list.length; colcount++) {
          columns = columns + this.props.list[colcount];
      }
    }
    var rowheight = (this.state.canvasheight - cm.comparisonHeight * (numOfRows - 1)) / numOfRows;
    var yscale = (this.state.canvasheight - cm.comparisonHeight * (numOfRows - 1)) / (columns * numOfRows);
    var rectHeight1 = yscale * this.props.list[0];
    var rectHeight2 = yscale * this.props.list[1];
    var yadjust = (rowheight + cm.comparisonHeight) * this.props.rownumber;
    var lineheight = rectHeight1;
    var linepos = cm.yoffset + (rowheight + cm.comparisonHeight) * this.props.rownumber;
    if (this.props.isFather) {
      yadjust += rectHeight1 / 2;
    } else {
      yadjust += rectHeight1 + rectHeight2 / 2;
      lineheight = rectHeight2;
      linepos += rectHeight1;
    }
    var lineleft = this.state.position;
    var ypos = cm.yoffset + yadjust - 8;
    return <div>
    <div  style={{position: 'absolute', top: linepos, left: lineleft, width: 1, height: lineheight, backgroundColor: 'black'}} />
      <div onMouseDown={this.onMouseDown} onMouseUp={this.onMouseUp} onMouseMove={this.onMouseMove} onClick={this.onMouseClick}
      onMouseLeave={this.onMouseLeave}
      style={{position: 'absolute', top: ypos, left: lineleft - 8, width: 15, height: 15, border: '1px solid black',
    borderRadius: '15px', backgroundColor: 'grey'}} />
      </div>
  }
});

var AssumedAncestryOverlay = React.createClass({
  getInitialState: function () {
    return({
      canvaswidth: cm.canvaswidth,
      canvasheight: cm.canvasheight,
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
      canvaswidth: cm.canvaswidth,
      canvasheight: cm.canvasheight,
    });
  },
    render: function() {
      var columns = 0;
      var numOfRows = this.props.rows;
      if (this.props.list != null) {
        for (var colcount = 0; colcount < this.props.list.length; colcount++) {
            columns = columns + this.props.list[colcount];
        }
      }

      var rowheight = (this.state.canvasheight - cm.comparisonHeight * (numOfRows - 1)) / numOfRows;
      var yscale = (this.state.canvasheight - cm.comparisonHeight * (numOfRows - 1)) / (columns * numOfRows);
      var rectWidth = this.state.canvaswidth +50;
      var rectHeight = yscale * this.props.list[0];
      // var dh = rectHeight;
      var xpos = 0;
      var ypos = 0;
      var dadstyle = overlaystyle(xpos, ypos, rectHeight, rectWidth, 10, '#407dbf', 'lightblue');
      ypos = rectHeight;
      rectHeight = yscale * this.props.list[1];
      // var mh = rectHeight;
      var mumstyle = overlaystyle(xpos, ypos, rectHeight, rectWidth, 10, '#ff8080', 'red');
      return (
          <div>
          <div style={dadstyle}></div>
          <div style={mumstyle}></div>
          </div>
      );
    }

});

var ButtonSetCrossover = React.createClass({
  getInitialState: function () {
    return({
      canvasheight: cm.canvasheight,
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
      canvasheight: cm.canvasheight,
    });
  },
  onClickFather: function (e) {
    cm.setCrossover(this.props.rownumber, true);
    e.stopPropagation();
  },
  onClickMother: function (e) {
    cm.setCrossover(this.props.rownumber, false);
    e.stopPropagation();
  },
    render: function() {
        var columns = 0;
        var numOfRows = this.props.rows;
        for (var colcount = 0; colcount < this.props.list.length; colcount++) {
            columns = columns + this.props.list[colcount];
        }


        var rectHeight = (this.state.canvasheight - cm.comparisonHeight * (numOfRows - 1)) / numOfRows;
        var ypos = cm.yoffset + (rectHeight + cm.comparisonHeight) * this.props.rownumber;


        // var rowheight = (this.state.canvasheight - cm.comparisonHeight * (numOfRows - 1)) / numOfRows;
        var yscale = (this.state.canvasheight - cm.comparisonHeight * (numOfRows - 1)) / (columns * numOfRows);

        var rectHeight1 = yscale * this.props.list[0];
        var xpos = cm.xoffset - 7;
        var ypos1 = cm.yoffset + (rectHeight + cm.comparisonHeight) * this.props.rownumber + rectHeight1 / 2 - 7;

        var rectHeight2 = yscale * this.props.list[1];
        ypos2 = cm.yoffset + (rectHeight + cm.comparisonHeight) * this.props.rownumber + rectHeight1 + rectHeight2 / 2 - 7;
        return (
            <div>
            <div onClick={this.onClickFather} style={{position: 'absolute', top: ypos1, left: xpos, width: 15, height: 15, border: '1px solid black',
            borderRadius: '15px', backgroundColor: 'red'}}></div>
            <div onClick={this.onClickMother} style={{position: 'absolute', top: ypos2, left: xpos, width: 15, height: 15, border: '1px solid black',
            borderRadius: '15px', backgroundColor: 'green'}}></div>
            </div>
        );
    }

});

// MatchBlock key={data.match + data.chromo + data.start} chromoIndex={chromosome} matchdata={data} columnlist={clist} rows={rows}
//     rownumber={rownumber} incommon={this.state.incommon}/>


var MatchBlock = React.createClass({
  getInitialState: function () {
    var color = this.getColor();
    return({
      mycolor: color,
      canvaswidth: cm.canvaswidth,
      canvasheight: cm.canvasheight,
      scale: cm.scale,
    });
  },
  getColor: function () {
    var color = getRelationColor(this.props.matchdata.match);
    if ( cm.inCommonWithSelectedMatch.indexOf(this.props.matchdata.match) > -1) {
        var kitnames = cm.kits.map(function(kit){ return kit.name; });
        if (kitnames.indexOf(this.props.matchdata.match) < 0) {
            color = 'lightgreen';
        }
    }
    return color;
  },
  componentDidMount: function () {
    cm.registerCallback(this);
  },
  componentWillUnmount: function () {
    cm.unregisterCallback(this);
  },
  update: function () {
    var color = this.getColor();
    this.setState({
      mycolor: color,
      canvaswidth: cm.canvaswidth,
      canvasheight: cm.canvasheight,
      scale: cm.scale,
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

      var rowheight = (this.state.canvasheight - cm.comparisonHeight * (numOfRows - 1)) / numOfRows;
      var yscale = (this.state.canvasheight - cm.comparisonHeight * (numOfRows - 1)) / (columns * numOfRows);

      var parentadjustment = 0;
      for (var i = 0; i < this.props.matchdata.bigcolumn; i++) {
          parentadjustment += this.props.columnlist[i] * yscale;
      }

      var xpos = Number(this.props.matchdata.start) * this.state.scale + cm.xoffset + cm.xinneroffset;
      var ypos = yscale * this.props.matchdata.column + cm.yoffset + (rowheight + cm.comparisonHeight) * this.props.rownumber + parentadjustment;

      var rectWidth = (this.props.matchdata.end - this.props.matchdata.start) * this.state.scale - 2;
      var rectHeight = yscale - 2;

      // var mycolor = getRelationColor(this.props.matchdata.match);

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
      canvaswidth: cm.canvaswidth,
      canvasheight: cm.canvasheight,
      scale: cm.scale,
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
      canvaswidth: cm.canvaswidth,
      canvasheight: cm.canvasheight,
      scale: cm.scale,
    });

  },
    render: function() {
        var numOfRows = this.props.rows;
        var rectHeight = (this.state.canvasheight - cm.comparisonHeight * (numOfRows - 1)) / numOfRows;
        var xpos = cm.xoffset + cm.xinneroffset;
        var ypos = cm.yoffset + rectHeight + (rectHeight + cm.comparisonHeight) * this.props.rownumber;
        var myHeight = cm.comparisonHeight;
        var myWidth = this.state.canvaswidth;
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
            height: cm.comparisonHeight / 2,
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
          myscale = this.state.scale;
            content = this.props.data.map( function(d) {
                var blockxpos = d.start * myscale;
                var blockwidth = (d.end - d.start) * myscale;
                var blockstyle = {
                    position: 'absolute',
                    top: 0,
                    left: blockxpos,
                    backgroundColor: '#f0f81d',
                    height: cm.comparisonHeight,
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
      canvaswidth: cm.canvaswidth,
      canvasheight: cm.canvasheight,
      scale: cm.scale,
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
      canvaswidth: cm.canvaswidth,
      canvasheight: cm.canvasheight,
      scale: cm.scale,
    });
  },
    render: function() {
      var numOfRows = this.props.rows;
      var rectHeight = (this.state.canvasheight - cm.comparisonHeight * (numOfRows - 1)) / numOfRows;
      var rectWidth = this.state.canvaswidth +50;
      var fSize = (rectHeight -20) + 'px';

      var xpos = cm.xoffset;
      var ypos = cm.yoffset + (rectHeight + cm.comparisonHeight) * this.props.rownumber;

      var cstyle = chromostyle(xpos, ypos, rectHeight, rectWidth, fSize);

      var xposCentro = cm.xinneroffset + centrostart[this.props.chromoIndex] * this.state.scale;
      var widthCentro = (centroend[this.props.chromoIndex] - centrostart[this.props.chromoIndex]) * this.state.scale;
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
      var overlaybuttons = null;
      if (this.state.useParent) {
          overlay = <AssumedAncestryOverlay list={this.props.list} rows={this.props.rows} rownumber={this.props.rownumber} />
          overlaybuttons = <ButtonSetCrossover list={this.props.list} rows={this.props.rows} rownumber={this.props.rownumber} />
      }

      // draws markers
      var markers = [];
      var markerids = [];
      var pos = 0;
      while (pos < chromolength[this.props.chromoIndex]) {
        var myleft = cm.xoffset + cm.xinneroffset + pos*this.state.scale;
        var newdiv = <div key={pos} style={{position: 'absolute', top: cm.yoffset-5,
          left: myleft, height: 5, width: 1, backgroundColor: 'black'}} ></div>
        var myid = pos / 1000000;
        var xoffset = -10;
        if (myid === 0) {
          xoffset += 7;
        }
        if (myid > 0 && myid < 100) {
          xoffset += 3;
        }
        var newid = <div key={pos} style={{position: 'absolute', top: cm.yoffset - 20,
          left: myleft + xoffset, color: 'black', fontFamily: '"Arial"', fontSize: 'small'}}>{myid}</div>
        markers.push(newdiv);
        markerids.push(newid);
        pos += 10000000;
      }

      return(
        <div>
          {markers}
          {markerids}
          <div style={cstyle} >
            {overlay}
            <div style={centrostyle}  />
            {this.props.chromosome}
          </div>
          {overlaybuttons}
        </div>
      );
    }
});
