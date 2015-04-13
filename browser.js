//var selectedChromosome = '1'; // testvariabel
var selectedLimit = '5';

var canvasheight = 600;
var canvaswidth = 1600;

//var numOfRows = 1;
//var rownumber = 0;
var yoffset = 40;

var BrowserHandler = React.createClass({
    getInitialState: function() {
        return { chromosome: '1',
                chromoIndex: 0,
                displaymode: 'A',
                matchSelect: null,
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
    clickMatchblock: function(e) {
        if (e.target.attributes.value != undefined) {
            this.setState({matchSelect: e.target.attributes.value.value});
            e.stopPropagation();
        }
    },
    render: function() {
        return(
            <div style={styles.main} >
            
            <ChromoSelector  onChange={this.selectedChromosome} />
            <form style={styles.displayselect} onChange={this.selectDisplay}>
                <select>
                    <option value='A'>Vis en</option>
                    <option value='B'>Sammenlign to, felles</option>
                    <option value='C'>Sammenlign to</option>
                    <option value='D'>Sammenlign tre, felles</option>
                    <option value='E'>Sammenlign fire, felles</option>
                </select>
            </form>
            <DisplaySelection click={this.clickMatchblock} kits={this.props.kits} selection={this.state.selection} chromosome={this.state.chromosome} chromoindex={this.state.chromoIndex} displaymode={this.state.displaymode} />
            <MatchInfo matchname={this.state.matchSelect} />
            </div>
        );
    }
});

var MatchInfo = React.createClass({
    render: function() {
        return (
            <div style={styles.matchinfo}>
            {this.props.matchname}
            </div>
        );
    }
});

var DisplaySelection = React.createClass({
    render: function() {
        if (this.props.displaymode == 'A') {
            return ( <Display1 click={this.props.click} kits={this.props.kits} selection={this.props.selection} chromosome={this.props.chromosome} chromoIndex={this.props.chromoindex}/> 
                   );
        } else if (this.props.displaymode == 'B'){
            return ( <Display2 click={this.props.click} kits={this.props.kits} selection={this.props.selection} chromosome={this.props.chromosome} chromoIndex={this.props.chromoindex}/> 
                   );
        } else if (this.props.displaymode == 'C'){
            return ( <Display3 click={this.props.click} kits={this.props.kits} selection={this.props.selection} chromosome={this.props.chromosome} chromoIndex={this.props.chromoindex}/> 
                   );
        } else if (this.props.displaymode == 'D'){
            return ( <Display4 click={this.props.click} kits={this.props.kits} selection={this.props.selection} chromosome={this.props.chromosome} chromoIndex={this.props.chromoindex}/> 
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
            <Chromosome chromoIndex={this.props.chromoIndex} chromosome={this.props.chromosome} rows={rows} rownumber={0}/>
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
        return(
            <div>
            <KitSelector onChange={this.handleChange1} kitlist={this.props.kits} />
            <KitSelector onChange={this.handleChange2} kitlist={this.props.kits} />
            <Chromosome chromoIndex={this.props.chromoIndex} chromosome={this.props.chromosome} rows={rows} rownumber={0}/>
            <Chromosome chromoIndex={this.props.chromoIndex} chromosome={this.props.chromosome} rows={rows} rownumber={1}/>
            <MatchBlocks click={this.props.click} chromoIndex={this.props.chromoIndex} matchdata={row0} rows={rows} rownumber={0} />
            <MatchBlocks click={this.props.click} chromoIndex={this.props.chromoIndex} matchdata={row1} rows={rows} rownumber={1} />
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
        return(
            <div>
            <KitSelector onChange={this.handleChange1} kitlist={this.props.kits} />
            <KitSelector onChange={this.handleChange2} kitlist={this.props.kits} />
            <Chromosome chromoIndex={this.props.chromoIndex} chromosome={this.props.chromosome} rows={rows} rownumber={0}/>
            <Chromosome chromoIndex={this.props.chromoIndex} chromosome={this.props.chromosome} rows={rows} rownumber={1}/>
            <Chromosome chromoIndex={this.props.chromoIndex} chromosome={this.props.chromosome} rows={rows} rownumber={2}/>
            <Chromosome chromoIndex={this.props.chromoIndex} chromosome={this.props.chromosome} rows={rows} rownumber={3}/>
            <MatchBlocks click={this.props.click} chromoIndex={this.props.chromoIndex} matchdata={row0} rows={rows} rownumber={0} />
            <MatchBlocks click={this.props.click} chromoIndex={this.props.chromoIndex} matchdata={row1} rows={rows} rownumber={1} />
            <MatchBlocks click={this.props.click} chromoIndex={this.props.chromoIndex} matchdata={row2} rows={rows} rownumber={2} />
            <MatchBlocks click={this.props.click} chromoIndex={this.props.chromoIndex} matchdata={row3} rows={rows} rownumber={3} />
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
        return(
            <div>
            <KitSelector onChange={this.handleChange1} kitlist={this.props.kits} />
            <KitSelector onChange={this.handleChange2} kitlist={this.props.kits} />
            <KitSelector onChange={this.handleChange3} kitlist={this.props.kits} />
            <Chromosome chromoIndex={this.props.chromoIndex} chromosome={this.props.chromosome} rows={rows} rownumber={0}/>
            <Chromosome chromoIndex={this.props.chromoIndex} chromosome={this.props.chromosome} rows={rows} rownumber={1}/>
            <Chromosome chromoIndex={this.props.chromoIndex} chromosome={this.props.chromosome} rows={rows} rownumber={2}/>
            <Chromosome chromoIndex={this.props.chromoIndex} chromosome={this.props.chromosome} rows={rows} rownumber={3}/>
            <MatchBlocks click={this.props.click} chromoIndex={this.props.chromoIndex} matchdata={row0} rows={rows} rownumber={0} />
            <MatchBlocks click={this.props.click} chromoIndex={this.props.chromoIndex} matchdata={row1} rows={rows} rownumber={1} />
            <MatchBlocks click={this.props.click} chromoIndex={this.props.chromoIndex} matchdata={row2} rows={rows} rownumber={2} />
            <MatchBlocks click={this.props.click} chromoIndex={this.props.chromoIndex} matchdata={row3} rows={rows} rownumber={3} />
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
        
        var matchblockStyle = matchstyle(xpos, ypos, rectHeight, rectWidth);
        return(
            <div style={matchblockStyle} value={this.props.matchdata.match} onClick={this.props.click}>
            <label value={this.props.matchdata.match} onClick={this.props.click}>{this.props.matchdata.match}</label>
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
        return(
            <div style={cstyle}>
            {this.props.chromosome}
            </div>
        );
    }
});


function sortChromodata(myowner, selectedChromosome){
    var mydata = [];
    if (myowner != null) {
    
    for (var i in myowner.matches){
        for (var j in myowner.matches[i].matchblocks) {
            var currentData = myowner.matches[i].matchblocks[j];
            
            if (currentData.chromo == selectedChromosome && Number(currentData.lngth) >= Number(selectedLimit)) {
                mydata[mydata.length] = new Data(currentData.match, currentData.chromo, currentData.start, currentData.end, currentData.lngth, currentData.snp);
            }
        }
    }
    mydata.sort(function (a, b) {
        return Number(a.start) - Number(b.start);
    })
    }
    return mydata;
}

function checkColumnList(datalist) {
        var columns = [];
        for (var i in datalist) {
            checkColumn(columns, datalist[i], 0);
        }
        return [columns.length];
}

function checkColumn(columnarray, data, currentcolumn) {
    if (columnarray.length <= currentcolumn) {
        data.column = currentcolumn;
        columnarray[currentcolumn] = data;
        return;
    }
    if (Number(columnarray[currentcolumn].end) > Number(data.start)) {
        checkColumn(columnarray, data, currentcolumn + 1);
    } else {
        data.column = currentcolumn;
        columnarray[currentcolumn] = data;
    }
}

function findCommonMatches(index1, index2){
    var result = [];
    var matches1 = findNames(index1);
    var matches2 = findNames(index2);
    for (var i = 0; i<matches1.length; i++){
        var pos = matches2.indexOf(matches1[i]);
        if (pos > -1) {
            result[result.length] = matches1[i];
        }
    }
    return result;
}

function findNames(owner){
    var matchnames = [];
    if (owner != null) {
        var matches = owner.matches;
        for (var i = 0; i< matches.length; i++ ){
            var pos = matchnames.indexOf(matches[i].name);
            if (pos == -1) {
                matchnames[matchnames.length] = matches[i].name;
            }
        }
    }
    return matchnames;
}

function testInCommon(person, inCommonList, useInCommon) {
    var isInCommon = [];
    for (var i in person) {
        var pos = inCommonList.indexOf(person[i].match);
        if (pos > -1 && useInCommon) {
            isInCommon[isInCommon.length] = new Data(person[i].match, person[i].chromo, person[i].start, person[i].end, person[i].lngth, person[i].snp) ;
        }
        if (pos == -1 && !useInCommon) {
            isInCommon[isInCommon.length] = new Data(person[i].match, person[i].chromo, person[i].start, person[i].end, person[i].lngth, person[i].snp) ;
        }
    }
    return isInCommon;
}

