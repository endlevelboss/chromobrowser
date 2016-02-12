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
        var defaultKit = null;
        if (kits.length > 0) {
            initValue = kits;
            defaultKit = kits[0];
        }
        return { chromosome: '1',
                chromoIndex: 0,
                displaymode: 'A',
                matchSelect: null,
                marker: null,
                dragging: false,
                kit1: defaultKit,
                kit2: defaultKit,
                kit3: defaultKit,
                useParent: false,
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
        this.setState({matchSelect: null,})  ;
    },
    clickMatchblock: function(e) {
        if (e.target.attributes.value != undefined) {
            this.setState({matchSelect: e.target.attributes.value.value});
            e.stopPropagation();
        }
    },
    kitSelection: function(e) {
        if (e.target.id == 1)
            this.setState({kit1: getKit(e.target.value)});
        if (e.target.id == 2)
            this.setState({kit2: getKit(e.target.value)});
        if (e.target.id == 3)
            this.setState({kit3: getKit(e.target.value)});
    },
    useParentCheckbox: function(e) {
        this.setState({useParent: e.target.checked});
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
                    <option value='E'>Compare two kits, not in common</option>
                    <option value='C'>Compare two kits</option>
                    <option value='D'>Compare three kits, in common</option>
                    
                </select>
            </form>
            <form>
            <input type={'checkbox'} onChange={this.useParentCheckbox} />
            </form>
            <KitSelector id={1} onChange={this.kitSelection} kitlist={this.props.kits} />
            <KitSelector id={2} onChange={this.kitSelection} kitlist={this.props.kits} />
            <KitSelector id={3} onChange={this.kitSelection} kitlist={this.props.kits} />
            <DisplaySelection deselect={this.onClick} click={this.clickMatchblock}  chromosome={this.state.chromosome} chromoindex={this.state.chromoIndex} displaymode={this.state.displaymode}  matchselection={this.state.matchSelect} kit1={this.state.kit1} kit2={this.state.kit2} kit3={this.state.kit3} useParent={this.state.useParent} />
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
        var incommonlist = findAllIncommon(this.props.matchselection);
        if (this.props.displaymode == 'A') {
            var data = sortChromodata(this.props.kit1, this.props.chromosome);
            return ( <Display deselect={this.props.deselect} click={this.props.click}  chromosome={this.props.chromosome} chromoIndex={this.props.chromoindex} incommon={incommonlist} data={[data]} users={[this.props.kit1]} compare={[]} useParent={this.props.useParent} /> 
                   );
        } 
        else if (this.props.displaymode == 'B'){
            var data1 = sortChromodata(this.props.kit1, this.props.chromosome);
            var data2 = sortChromodata(this.props.kit2, this.props.chromosome);
            var incommon = findCommonMatches(this.props.kit1, this.props.kit2);
            var row0 = testInCommon(data1, incommon, true);
            var row1 = testInCommon(data2, incommon, true);
            var kitsCompared = compareKitsInCommon(data1, [this.props.kit2],true);
            var raw = compareRawdata(this.props.kit1, this.props.kit2, this.props.chromosome);
            return ( <Display deselect={this.props.deselect} click={this.props.click}  chromosome={this.props.chromosome} chromoIndex={this.props.chromoindex} incommon={incommonlist} data={[row0, row1]} users={[this.props.kit1,this.props.kit2]} compare={[[kitsCompared, raw, 0]]} useParent={this.props.useParent}/> 
                   );
        } 
        else if (this.props.displaymode == 'C'){
            var data1 = sortChromodata(this.props.kit1, this.props.chromosome);
            var data2 = sortChromodata(this.props.kit2, this.props.chromosome);
            var incommon = findCommonMatches(this.props.kit1, this.props.kit2);
            var row0 = testInCommon(data1, incommon, false);
            var row1 = testInCommon(data1, incommon, true);
            var row2 = testInCommon(data2, incommon, true);
            var row3 = testInCommon(data2, incommon, false);
            var kitsCompared = compareKitsInCommon(data1, [this.props.kit2],true);
            var raw = compareRawdata(this.props.kit1, this.props.kit2, this.props.chromosome);
            return ( <Display deselect={this.props.deselect} click={this.props.click}  chromosome={this.props.chromosome} chromoIndex={this.props.chromoindex} incommon={incommonlist} data={[row0, row1, row2, row3]} users={[this.props.kit1,this.props.kit1,this.props.kit2, this.props.kit2]} compare={[[kitsCompared, raw, 1]]} useParent={this.props.useParent}/> 
                   );
        } 
        else if (this.props.displaymode == 'D'){
            var data1 = sortChromodata(this.props.kit1, this.props.chromosome);
            var data2 = sortChromodata(this.props.kit2, this.props.chromosome);
            var data3 = sortChromodata(this.props.kit3, this.props.chromosome);
            var incommon = findCommonMatches(this.props.kit1, this.props.kit2);
            var incommon2 = findCommonMatches(this.props.kit3, this.props.kit2);
            var row0 = testInCommon(data1, incommon, true);
            var row1 = testInCommon(data2, incommon, true);
            var row2 = testInCommon(data2, incommon2, true);
            var row3 = testInCommon(data3, incommon2, true);
            var kitsCompared1 = compareKitsInCommon(data1, [this.props.kit2],true);
            var raw1 = compareRawdata(this.props.kit1, this.props.kit2, this.props.chromosome);
            var kitsCompared2 = compareKitsInCommon(data2, [this.props.kit3],true);
            var raw2 = compareRawdata(this.props.kit3, this.props.kit2, this.props.chromosome);
            return ( <Display deselect={this.props.deselect} click={this.props.click}  chromosome={this.props.chromosome} chromoIndex={this.props.chromoindex} incommon={incommonlist} data={[row0, row1, row2, row3]} users={[this.props.kit1,this.props.kit2,this.props.kit2, this.props.kit3]} compare={[[kitsCompared1, raw1, 0],[kitsCompared2, raw2, 2]]} useParent={this.props.useParent}/> 
                   );
        }
        else if (this.props.displaymode == 'E'){
            var data1 = sortChromodata(this.props.kit1, this.props.chromosome);
            var data2 = sortChromodata(this.props.kit2, this.props.chromosome);
            var incommon = findCommonMatches(this.props.kit1, this.props.kit2);
            var row0 = testInCommon(data1, incommon, false);
            var row1 = testInCommon(data2, incommon, false);
            var kitsCompared = compareKitsInCommon(data1, [this.props.kit2],true);
            var raw = compareRawdata(this.props.kit1, this.props.kit2, this.props.chromosome);
            return ( <Display deselect={this.props.deselect} click={this.props.click}  chromosome={this.props.chromosome} chromoIndex={this.props.chromoindex} incommon={incommonlist} data={[row0, row1]} users={[this.props.kit1,this.props.kit2]} compare={[[kitsCompared, raw, 0]]} useParent={this.props.useParent}/> 
                   );
        } 
        
        else {
            return <div></div>
        }
    }
});


var Display = React.createClass({
    
   render: function() {
       var length = this.props.data.length;
       var matchblocks = [];
       for (var i = 0; i< length; i++){
            matchblocks[i] = <MatchBlocks key={i} click={this.props.click} chromoIndex={this.props.chromoIndex} chromosome={this.props.chromosome} matchdata={this.props.data[i]} rows={length} rownumber={i} incommon={this.props.incommon} user={this.props.users[i]} useParent={this.props.useParent}/>
        }
       var compared = [];
       
       for (var i=0; i<this.props.compare.length; i++) {
           compared[i] = <ComparedKits key={i} data={this.props.compare[i][0]} chromoIndex={this.props.chromoIndex} rows={length} rownumber={this.props.compare[i][2]} raw={this.props.compare[i][1]} />
       }
       return(
           <div>
            <DisplayWithMarker deselect={this.props.deselect} matchblocks={matchblocks} compared={compared} />
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
        this.props.deselect();
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
    render: function() {
        var content = null;
        
        var clist = checkColumnList(this.props.matchdata, this.props.useParent, this.props.user.name);
        var chromosome = this.props.chromoIndex;
        var rows = this.props.rows;
        var rownumber = this.props.rownumber;
        if (this.props.matchdata != null) {
            content = this.props.matchdata.map( function(data) {
                return( <MatchBlock key={data.match + data.chromo + data.start} chromoIndex={chromosome} matchdata={data} columnlist={clist} rows={rows} rownumber={rownumber} click={this.props.click} incommon={this.props.incommon}/>
                      );
                       }.bind(this)
                                              );
        }
        return ( 
            <div>
            <Chromosome chromosome={this.props.chromosome} list={clist} chromoIndex={this.props.chromoIndex} rows={this.props.rows} rownumber={this.props.rownumber} useParent={this.props.useParent} />
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
        
        var parentadjustment = 0;
        for (var i = 0; i < this.props.matchdata.bigcolumn; i++) {
            parentadjustment += this.props.columnlist[i] * yscale;
        }
        
        var xpos = Number(this.props.matchdata.start) * scale + 50;
        var ypos = yscale * this.props.matchdata.column + 25 + (rowheight + 6) * this.props.rownumber + parentadjustment; 
        
        var rectWidth = (this.props.matchdata.end - this.props.matchdata.start) * scale - 2;
        var rectHeight = yscale - 2;
        
        var mycolor = getRelationColor(this.props.matchdata.match);
        if (this.props.incommon.indexOf(this.props.matchdata.match) > -1) {
            var kitnames = kits.map(function(kit){ return kit.name; });
            if (kitnames.indexOf(this.props.matchdata.match) < 0) {
                mycolor = 'lightgreen';
            }
        }
        
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
        if (this.props.raw != null && this.props.raw.length > 0) {
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
        if (this.props.useParent) {
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