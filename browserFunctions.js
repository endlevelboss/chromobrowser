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
    for (var i = 0; i < match.customdata.length; i++) {
        if (match.customdata[i].type == type) {
            value = match.customdata[i].data;
        }
    }
    return value;
}

function setMatch(matchname) {
    var matches = getUserdata('matches');
    for (var i=0; i<matches.length; i++) {
        if (matches[i].name == matchname)
            return matches[i];
    }
    var newmatch = new MatchCustom(matchname);
    matches[matches.length] = newmatch;
    return newmatch;
}

function getMatch(matchname) {
    var matches = getUserdata('matches');
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
