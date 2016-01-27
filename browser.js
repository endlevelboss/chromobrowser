//var selectedChromosome = '1'; // testvariabel
var selectedLimit = '5';

var canvasheight = 600;
var canvaswidth = 1600;

//var numOfRows = 1;
//var rownumber = 0;
var yoffset = 40;

var BrowserHandler = React.createClass({
    getInitialState: function() {
        var initValue = null;
        if (kits.length > 0)
            initValue = kits;
        return { chromosome: '1',
                chromoIndex: 0,
                displaymode: 'A',
                matchSelect: null,
                marker: null,
                dragging: false,
                selections: initValue,
               }
    },
    selectedChromosome: function(e) {
        if (e.target != null) {
            this.setState({chromosome: e.target.value});
            this.setState({chromoIndex: e.target.selectedIndex});
        }
    },
    selectDisplay: function(e) {
        if (e.target != null) {
            this.setState({displaymode: e.target.value});
        }
    },
    onClick: function(e) {
        if (e.button !== 0) return;
        this.setState({
            dragging: true,
            matchSelect: null,
        });
        e.stopPropagation();
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
    onMouseMove: function(e) {
        var xpos = e.pageX;
        var mystyle = {
            position: 'absolute',
            top: '25px',
            left: xpos + 'px',
            height: '550px',
            width: '2px',
            backgroundColor: 'darkslategray',
            zIndex: '200',
        };
        var mymarker = <div style={mystyle} />
        this.setState({
            marker: mymarker,
        });
        e.stopPropagation();
    },
    onMouseUp: function(e) {
        this.setState({dragging: false})
        e.stopPropagation()
        e.preventDefault()
    },
    clickMatchblock: function(e) {
        if (e.target.attributes.value != undefined) {
            this.setState({matchSelect: e.target.attributes.value.value});
            e.stopPropagation();
        }
    },
    update: function() {
        this.forceUpdate();
    },
    render: function() {
        var matchinfo = null;
        if (this.state.matchSelect != null) {
            matchinfo = <MatchInfo update={this.update} matchname={this.state.matchSelect} />
        }
        return(
            <div style={styles.main} >
            
            <ChromoSelector  onChange={this.selectedChromosome} />
            <form style={styles.displayselect} onChange={this.selectDisplay}>
                <select>
                    <option value='A'>Single kit</option>
                    <option value='B'>Compare two kits, in common</option>
                    <option value='C'>Compare two kits</option>
                    <option value='D'>Compare three kits, in common</option>
                    <option value='E'>Compare four kits, in common</option>
                </select>
            </form>
            <DisplaySelection deselect={this.onClick} click={this.clickMatchblock} kits={this.props.kits} selection={this.state.selection} chromosome={this.state.chromosome} chromoindex={this.state.chromoIndex} displaymode={this.state.displaymode} selections={this.state.selections} />
            {this.state.marker}
            {matchinfo}
            </div>
        );
    }
});

var MatchInfo = React.createClass({
    change: function(e) {
        setAncestry(this.props.matchname, e.target.value);
        this.props.update();
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

var DisplaySelection = React.createClass({
    render: function() {
        if (this.props.displaymode == 'A') {
            return ( <Display1 deselect={this.props.deselect} click={this.props.click} kits={this.props.kits} selection={this.props.selection} chromosome={this.props.chromosome} chromoIndex={this.props.chromoindex}/> 
                   );
        } else if (this.props.displaymode == 'B'){
            return ( <Display2 deselect={this.props.deselect} click={this.props.click} kits={this.props.kits} selection={this.props.selection} chromosome={this.props.chromosome} chromoIndex={this.props.chromoindex}/> 
                   );
        } else if (this.props.displaymode == 'C'){
            return ( <Display3 deselect={this.props.deselect} click={this.props.click} kits={this.props.kits} selection={this.props.selection} chromosome={this.props.chromosome} chromoIndex={this.props.chromoindex}/> 
                   );
        } else if (this.props.displaymode == 'D'){
            return ( <Display4 deselect={this.props.deselect} click={this.props.click} kits={this.props.kits} selection={this.props.selection} chromosome={this.props.chromosome} chromoIndex={this.props.chromoindex}/> 
                   );
        }
        
        else {
            return <div></div>
        }
    }
});




var Display1 = React.createClass({
    getInitialState: function() {
        var initValue = null;
        if (kits.length > 0)
            initValue = kits[0];
        return { selection: initValue,
               }
    },
    handleChange: function(e) {
        if(e.target != null) {
            this.setState({selection: getKit(e.target.value)});
        }
    },
    render: function() {
        var rows = 1;
        var data = sortChromodata(this.state.selection, this.props.chromosome);
        return(
            <div>
            <KitSelector onChange={this.handleChange} kitlist={this.props.kits} />
            <Chromosome deselect={this.props.deselect}  chromoIndex={this.props.chromoIndex} chromosome={this.props.chromosome} rows={rows} rownumber={0}/>
            <MatchBlocks click={this.props.click} chromoIndex={this.props.chromoIndex} matchdata={data} rows={rows} rownumber={0} />
            </div>
        )
    }
});

var Display2 = React.createClass({
    getInitialState: function() {
        var initValue = null;
        if (kits.length > 0)
            initValue = kits[0];
        return { selection1: initValue,
                selection2: initValue,
               }
    },
    handleChange1: function(e) {
        if(e.target != null) {
            this.setState({selection1: getKit(e.target.value)});
        }
    },
    handleChange2: function(e) {
        if(e.target != null) {
            this.setState({selection2: getKit(e.target.value)});
        }
    },
    render: function() {
        var rows = 2;
        var data1 = sortChromodata(this.state.selection1, this.props.chromosome);
        var data2 = sortChromodata(this.state.selection2, this.props.chromosome);
        
        var incommon = findCommonMatches(this.state.selection1, this.state.selection2);
        var row0 = testInCommon(data1, incommon, true);
        var row1 = testInCommon(data2, incommon, true);
        var kitsCompared = compareKitsInCommon(data1, [this.state.selection2],true);
        var raw = compareRawdata(this.state.selection1, this.state.selection2, this.props.chromosome);
        return(
            <div>
            <KitSelector onChange={this.handleChange1} kitlist={this.props.kits} />
            <KitSelector onChange={this.handleChange2} kitlist={this.props.kits} />
            <Chromosome deselect={this.props.deselect}  chromoIndex={this.props.chromoIndex} chromosome={this.props.chromosome} rows={rows} rownumber={0}/>
            <Chromosome deselect={this.props.deselect}  chromoIndex={this.props.chromoIndex} chromosome={this.props.chromosome} rows={rows} rownumber={1}/>
            <MatchBlocks click={this.props.click} chromoIndex={this.props.chromoIndex} matchdata={row0} rows={rows} rownumber={0} />
            <MatchBlocks click={this.props.click} chromoIndex={this.props.chromoIndex} matchdata={row1} rows={rows} rownumber={1} />
            <ComparedKits data={kitsCompared} chromoIndex={this.props.chromoIndex} rows={rows} rownumber={0} raw={raw} />
            </div>
        )
    }
});

var Display3 = React.createClass({
    getInitialState: function() {
        var initValue = null;
        if (kits.length > 0)
            initValue = kits[0];
        return { selection1: initValue,
                selection2: initValue,
               }
    },
    handleChange1: function(e) {
        if(e.target != null) {
            this.setState({selection1: getKit(e.target.value)});
        }
    },
    handleChange2: function(e) {
        if(e.target != null) {
            this.setState({selection2: getKit(e.target.value)});
        }
    },
    render: function() {
        var rows = 4;
        var data1 = sortChromodata(this.state.selection1, this.props.chromosome);
        var data2 = sortChromodata(this.state.selection2, this.props.chromosome);
        var incommon = findCommonMatches(this.state.selection1, this.state.selection2);
        var row0 = testInCommon(data1, incommon, false);
        var row1 = testInCommon(data1, incommon, true);
        var row2 = testInCommon(data2, incommon, true);
        var row3 = testInCommon(data2, incommon, false);
        var kitsCompared = compareKitsInCommon(data1, [this.state.selection2],true);
        return(
            <div>
            <KitSelector onChange={this.handleChange1} kitlist={this.props.kits} />
            <KitSelector onChange={this.handleChange2} kitlist={this.props.kits} />
            <Chromosome deselect={this.props.deselect} chromoIndex={this.props.chromoIndex} chromosome={this.props.chromosome} rows={rows} rownumber={0}/>
            <Chromosome deselect={this.props.deselect} chromoIndex={this.props.chromoIndex} chromosome={this.props.chromosome} rows={rows} rownumber={1}/>
            <Chromosome deselect={this.props.deselect} chromoIndex={this.props.chromoIndex} chromosome={this.props.chromosome} rows={rows} rownumber={2}/>
            <Chromosome deselect={this.props.deselect} chromoIndex={this.props.chromoIndex} chromosome={this.props.chromosome} rows={rows} rownumber={3}/>
            <MatchBlocks click={this.props.click} chromoIndex={this.props.chromoIndex} matchdata={row0} rows={rows} rownumber={0} />
            <MatchBlocks click={this.props.click} chromoIndex={this.props.chromoIndex} matchdata={row1} rows={rows} rownumber={1} />
            <MatchBlocks click={this.props.click} chromoIndex={this.props.chromoIndex} matchdata={row2} rows={rows} rownumber={2} />
            <MatchBlocks click={this.props.click} chromoIndex={this.props.chromoIndex} matchdata={row3} rows={rows} rownumber={3} />
            <ComparedKits data={kitsCompared} chromoIndex={this.props.chromoIndex} rows={rows} rownumber={1} />
            </div>
        )
    }
});

var Display4 = React.createClass({
    getInitialState: function() {
        var initValue = null;
        if (kits.length > 0)
            initValue = kits[0];
        return { selection1: initValue,
                selection2: initValue,
                selection3: initValue,
               }
    },
    handleChange1: function(e) {
        if(e.target != null) {
            this.setState({selection1: getKit(e.target.value)});
        }
    },
    handleChange2: function(e) {
        if(e.target != null) {
            this.setState({selection2: getKit(e.target.value)});
        }
    },
    handleChange3: function(e) {
        if(e.target != null) {
            this.setState({selection3: getKit(e.target.value)});
        }
    },
    render: function() {
        var rows = 4;
        var data1 = sortChromodata(this.state.selection1, this.props.chromosome);
        var data2 = sortChromodata(this.state.selection2, this.props.chromosome);
        var data3 = sortChromodata(this.state.selection3, this.props.chromosome);
        var incommon = findCommonMatches(this.state.selection1, this.state.selection2);
        var incommon2 = findCommonMatches(this.state.selection3, this.state.selection2);
        var row0 = testInCommon(data1, incommon, true);
        var row1 = testInCommon(data2, incommon, true);
        var row2 = testInCommon(data2, incommon2, true);
        var row3 = testInCommon(data3, incommon2, true);
        var kitsCompared1 = compareKitsInCommon(data1, [this.state.selection2],true);
        var kitsCompared2 = compareKitsInCommon(data2, [this.state.selection3],true);
        return(
            <div>
            <KitSelector onChange={this.handleChange1} kitlist={this.props.kits} />
            <KitSelector onChange={this.handleChange2} kitlist={this.props.kits} />
            <KitSelector onChange={this.handleChange3} kitlist={this.props.kits} />
            <Chromosome deselect={this.props.deselect} chromoIndex={this.props.chromoIndex} chromosome={this.props.chromosome} rows={rows} rownumber={0}/>
            <Chromosome deselect={this.props.deselect} chromoIndex={this.props.chromoIndex} chromosome={this.props.chromosome} rows={rows} rownumber={1}/>
            <Chromosome deselect={this.props.deselect} chromoIndex={this.props.chromoIndex} chromosome={this.props.chromosome} rows={rows} rownumber={2}/>
            <Chromosome deselect={this.props.deselect} chromoIndex={this.props.chromoIndex} chromosome={this.props.chromosome} rows={rows} rownumber={3}/>
            <MatchBlocks click={this.props.click} chromoIndex={this.props.chromoIndex} matchdata={row0} rows={rows} rownumber={0} />
            <MatchBlocks click={this.props.click} chromoIndex={this.props.chromoIndex} matchdata={row1} rows={rows} rownumber={1} />
            <MatchBlocks click={this.props.click} chromoIndex={this.props.chromoIndex} matchdata={row2} rows={rows} rownumber={2} />
            <MatchBlocks click={this.props.click} chromoIndex={this.props.chromoIndex} matchdata={row3} rows={rows} rownumber={3} />
            <ComparedKits data={kitsCompared1} chromoIndex={this.props.chromoIndex} rows={rows} rownumber={0} />
            <ComparedKits data={kitsCompared2} chromoIndex={this.props.chromoIndex} rows={rows} rownumber={2} />
            </div>
        )
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
    render: function() {
        var content = null;
        //var columnlist = checkColumnList(data);
        var clist = checkColumnList(this.props.matchdata);
        var chromosome = this.props.chromoIndex;
        var rows = this.props.rows;
        var rownumber = this.props.rownumber;
        if (this.props.matchdata != null) {
            content = this.props.matchdata.map( function(data) {
                return( <MatchBlock key={data.match + data.chromo + data.start} chromoIndex={chromosome} matchdata={data} columnlist={clist} rows={rows} rownumber={rownumber} click={this.props.click}/>
                      );
                       }.bind(this)
                                              );
        }
        return ( <div>{content}</div>
               );
    }
});

var MatchBlock = React.createClass({
    render: function() {
        var columns = 0;
        var numOfRows = this.props.rows;
        for (var colcount = 0; colcount < this.props.columnlist.length; colcount++) {
            columns = columns + this.props.columnlist[colcount];
        }
        var rowheight = (canvasheight - 50 - 6 * (numOfRows - 1)) / numOfRows;
        var yscale = (canvasheight - 50 - 6 * (numOfRows - 1)) / (columns * numOfRows);
        var scale = (canvaswidth - 50) / chromolength[this.props.chromoIndex];
        var xpos = Number(this.props.matchdata.start) * scale + 50;
        var ypos = yscale * this.props.matchdata.column + 25 + (rowheight + 6) * this.props.rownumber; 
        
        var rectWidth = (this.props.matchdata.end - this.props.matchdata.start) * scale - 2;
        var rectHeight = yscale - 2;
        
        var mycolor = getRelationColor(this.props.matchdata.match);
        var matchblockStyle = matchstyle(xpos, ypos, rectHeight, rectWidth, mycolor);
        return(
            <div style={matchblockStyle} value={this.props.matchdata.match} onClick={this.props.click}>
            <label className={'unselectable'} value={this.props.matchdata.match} onClick={this.props.click}>{this.props.matchdata.match}</label>
            </div>
        );
    }
});


var ComparedKits = React.createClass({
    render: function() {
        var numOfRows = this.props.rows;
        var scale = (canvaswidth - 50) / chromolength[this.props.chromoIndex];
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
        if (this.props.raw.length > 0) {
            rawDisplay = (
                <div style={rawstyle}>
            <Graphic raw={this.props.raw} chromoIndex={this.props.chromoIndex} />
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
    render: function() {
        var numOfRows = this.props.rows;
        var scale = (canvaswidth - 50) / chromolength[this.props.chromoIndex];
        var rectHeight = (canvasheight - 50 - 6 * (numOfRows - 1)) / numOfRows;
        var rectWidth = canvaswidth;
        var fSize = (rectHeight -20) + 'px';
        
        var xpos = 25;
        var ypos = 25 + (rectHeight + 6) * this.props.rownumber;
        
        var cstyle = chromostyle(xpos, ypos, rectHeight, rectWidth, fSize);
        
        var xposCentro = centrostart[this.props.chromoIndex] * scale;
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
        
        return(
            <div style={cstyle} onClick={this.props.deselect}>
            <div style={centrostyle} onClick={this.props.deselect} />
            {this.props.chromosome}
            </div>
        );
    }
});