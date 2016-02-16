function sortChromodata(myowner, selectedChromosome){
    var mydata = [];
    if (myowner != null) {
      var exclusionlist = getExclusionList(myowner.name);
      for (var i in myowner.matches){
          if (exclusionlist.indexOf(myowner.matches[i].name) < 0) {
              for (var j in myowner.matches[i].matchblocks) {
                  var currentData = myowner.matches[i].matchblocks[j];

                  if (currentData.chromo == selectedChromosome && Number(currentData.lngth) >= Number(selectedLimit)) {
                      mydata[mydata.length] = new Data(currentData.match, currentData.chromo, currentData.start, currentData.end, currentData.lngth, currentData.snp);
                  }
              }
          }
      }
      mydata.sort(function (a, b) {
          return Number(a.start) - Number(b.start);
      });
    }
    return mydata;
}

function getHeritageMap(kitname) {
    var kitBox = findRelation(kitname);
    var father = findRelation(kitBox.father);
    var mother = findRelation(kitBox.mother);

    var viaDad = false;
    var viaMum = false;
    var mymap = [];

    var personBoxes = getRelations();
    for (var j in personBoxes) {
        viaDad = traceAncestor(father, personBoxes[j].name);
        viaMum = traceAncestor(mother, personBoxes[j].name);
        var mapping = null;
        if (viaDad) {
            mapping = [personBoxes[j].name, 0];
        } else if (viaMum) {
            mapping = [personBoxes[j].name, 1];
        } else {
            mapping = [personBoxes[j].name, 2];
        }
        mymap[mymap.length] = mapping;
    }
    return mymap;
}

function traceAncestor(personBox, ancestorname) {
    if (personBox == null) {
        return false;
    }
    if (personBox.name == ancestorname) {
        return true;
    }
    var dad = findRelation(personBox.father);
    var mum = findRelation(personBox.mother);
    if (traceAncestor(dad, ancestorname) || traceAncestor(mum, ancestorname)) {
        return true;
    } else {
        return false;
    }
}

function findCommonLineage(kitname, heritage) {
    var heritageMap = getHeritageMap(kitname);
    var matchvalue = 2;
    for (var i in heritageMap) {
        if (heritageMap[i][0] == heritage) {
            matchvalue = heritageMap[i][1];
        }
    }
    return matchvalue;
}

function checkColumnList(datalist, isParentsChecked, kitname) {
    //console.log('recalcing matches: ' + isParentsChecked);
    if (isParentsChecked) {
        var fathermatches = [];
        var fathercolumns = [];
        var mothermatches = [];
        var mothercolumns = [];
        var unknownmatches = [];
        var unknowncolumns = [];
        for (var i in datalist) {
            var match = getMatch(datalist[i].match);
            var heritage = getCustomdata(match, 'relation');
            if (heritage != null) {
                var myheritage = findCommonLineage(kitname, heritage);
                datalist[i].bigcolumn = myheritage;
                if (myheritage == 0) {
                    fathermatches[fathermatches.length] = datalist[i];
                } else if (myheritage == 1) {
                    mothermatches[mothermatches.length] = datalist[i];
                } else {
                    unknownmatches[unknownmatches.length] = datalist[i];
                }
            } else {
                datalist[i].bigcolumn = 2;
                unknownmatches[unknownmatches.length] = datalist[i];
            }
        }

        for (var i =0; i< fathermatches.length; i++) {
            checkColumn(fathercolumns, fathermatches[i], 0);
        }
        for (var i =0; i< mothermatches.length; i++) {
            checkColumn(mothercolumns, mothermatches[i], 0);
        }
        for (var i =0; i< unknownmatches.length; i++) {
            checkColumn(unknowncolumns, unknownmatches[i], 0);
        }

        var flength = fathercolumns.length;
        var mlength = mothercolumns.length;
        if (flength == 0) {
            flength = 1;
        }
        if (mlength == 0) {
            mlength = 1;
        }
        return [flength, mlength, unknowncolumns.length];
    } else {
        var columns = [];
        for (var i in datalist) {
            checkColumn(columns, datalist[i], 0);
        }
        return [columns.length];
    }
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

function compareKitsInCommon(person, selectionList, useInCommon) {
    var inCommonList = [];
    if (selectionList.length > 0 && selectionList[0] != null) {
            inCommonList = selectionList.map( function(data) {
                return data.name;
                       });
    }
    var result = testInCommon(person, inCommonList, useInCommon);
    return result;
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

function MatchCustom(name) {
    this.name = name;
    this.customdata = [];
}

function Customdata(type, data) {
    this.type = type;
    this.data = data;
}

function setAncestry(matchname, ancestryname) {
    var match = setMatch(matchname);
    setCustomdata(match, 'relation', ancestryname);
}

function setCustomdata(match, type, value) {
    for (var i = 0; i < match.customdata.length; i++) {
        if (match.customdata[i].type == type) {
            match.customdata[i].data = value;
            return;
        }
    }
    match.customdata[match.customdata.length] = new Customdata(type, value);
}

function getCustomdata(match, type) {
    var value = null;
    if(match != null) {
        for (var i = 0; i < match.customdata.length; i++) {
            if (match.customdata[i].type == type) {
                value = match.customdata[i].data;
            }
        }
    }
    return value;
}

function setMatch(matchname) {
    var matches = cm.getUserdata('matches');
    for (var i=0; i<matches.length; i++) {
        if (matches[i].name == matchname)
            return matches[i];
    }
    var newmatch = new MatchCustom(matchname);
    matches[matches.length] = newmatch;
    return newmatch;
}

function getMatch(matchname) {
    var matches = cm.getUserdata('matches');
    for (var i=0; i<matches.length; i++) {
        if (matches[i].name == matchname)
            return matches[i];
    }
    return null;
}

function getRelationColor(matchname) {
    var match = getMatch(matchname);
    if (match != null) {
        var relationName = getCustomdata(match, 'relation');
        if (relationName != null) {
            var relation = findRelation(relationName);
            if (relation != null) {
                return relation.color;
            }
        }
    }
    return null;
}


function simpleRawSort(rawA, rawB) {
    var ordered = [];
    var cont = true;
    var a = rawA.shift();
    //console.log(Number(a[2]));
    var b = rawB.shift();
    while (cont) {
        if (a == undefined || b == undefined) {
            cont = false;
        } else if (Number(a[2]) == Number(b[2])) {
            ordered[ordered.length] = [a[3], b[3], a[2]];
            a = rawA.shift();
            b = rawB.shift();
        } else if (Number(a[2]) > Number(b[2])) {
            //console.log( a.position + ' > ' + b.position );
            b = rawB.shift();
        } else {
            //console.log(a.position + ' < ' + b.position );
            a = rawA.shift();
        }
    }
    return ordered;
}

function compareRaw(rawA, rawB) {
    var raw = simpleRawSort(rawA, rawB);
    var comparison = [];
    var compared = null;
    for (var i = 0; i < raw.length; i++) {
        var geneA = raw[i][0].split();
        var geneB = raw[i][1].split();
        compared = {
            color: 'black',
            position: raw[i][2]
        };
        if (geneA[0] == geneB[0] && geneA[1] == geneB[1]) {
                compared.color = 'limegreen';
        } else if (geneA[0] == geneB[1] && geneA[1] == geneB[0]) {
                compared.color = 'limegreen';
        }
        comparison[comparison.length] = compared;
    }
    return comparison;
}

function sortRawdata(selectedPerson, selectedChromosome) {
    //console.log(kitRawdata);
    var myraw = [];
    for (var j = 0; j < cm.kitRawdata.length; j++) {
        if(cm.kitRawdata[j].name == selectedPerson) {
            myraw = cm.kitRawdata[j].data;
        }
    }
    var mydata = [];
    for (var i = 0; i < myraw.length; i++) {
        if (myraw[i][1] == selectedChromosome) {
            mydata[mydata.length] = myraw[i];
        }
    }
    return mydata;
}

function compareRawdata(selectedA, selectedB, selectedChromosome) {
    var compared =[];
    if (selectedA != null || selectedB != null) {
        var rawA = sortRawdata(selectedA.name, selectedChromosome);
        var rawB = sortRawdata(selectedB.name, selectedChromosome);
        //console.log(rawA);
        if (rawA.length != 0 && rawB.length != 0) {
            compared = compareRaw(rawA, rawB);
        }
    }
    return compared;
}

function drawRaw(){
    // alert('tegner raw');
    var canvas = document.getElementById("chromobrowser");
    var context = canvas.getContext("2d");
    var scale = (canvas.width - 50) / chromolength[chromosomeIndex];
    var drawHeight = canvas.height - 50;
    var rowheight = (drawHeight - 6 * (numOfRows - 1)) / numOfRows;

    var ypos = 25 + rowheight * afterRowNumber + 6 *(afterRowNumber - 1) ;

    context.fillStyle = 'red';
    context.fillRect(25, ypos, canvas.width - 50, 6);
    context.fillStyle = 'yellow';
    for (var j = 0; j < blockdata.length; j++){
        var xpos = blockdata[j].start * scale + 25;
        var rectWidth = (blockdata[j].end - blockdata[j].start) * scale;
        context.fillRect(xpos, ypos, rectWidth, 6);
    }
    console.log(data.length);
    if (data.length > 0) {
        context.fillStyle = 'lightGrey';
        context.fillRect(25, ypos, canvas.width - 50, 3);
    }

    for (var i=0; i<data.length; i++) {
        //alert('iter:' + i + ' ' + data[i].color + ' ' + data[i].position);
        context.fillStyle = data[i].color;
        var xpos = data[i].position * scale + 25;
        context.fillRect(xpos, ypos, 1, 3);
    }
}
