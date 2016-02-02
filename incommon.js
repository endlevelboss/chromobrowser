function MatchData(name) {
    this.name = name;
    this.data = [];
}

function addInCommon(kitname, matchname, namelist) {
    for (var i = 1; i< namelist.length -1; i++){
        addInCommonMatch(namelist[i], kitname, matchname, true);
    }
}

function addInCommonMatch(name, kitname, matchname, continueLoop) {
    var userdata = getUserdata('incommon');
    var match = findByNameIncommon(matchname, userdata);
    if (match == null) {
        match = new MatchData(matchname);
        userdata[userdata.length] = match;
    }
    var kit = findByNameIncommon(kitname, match.data);
    if (kit == null) {
        kit = new MatchData(kitname);
        match.data[match.data.length] = kit;
    }
    var incommon = findByNameIncommon(name, kit.data);
    if (incommon == null) {
        incommon = new MatchData(name);
        kit.data[kit.data.length] = incommon;
        if (continueLoop) {
            addInCommonMatch(matchname, kitname, name, false);
        }
    }
}

function findByNameIncommon(name, data) {
    for (var i = 0; i < data.length; i++){
        if (data[i].name == name){
            return data[i];
        }
    }
    return null;
}

function findAllIncommon(name) {
    var result = [];
    var userdata = getUserdata('incommon');
    var match = findByNameIncommon(name, userdata);
    if (match != null) {
        match.data.map(function(item){
           item.data.map(function(incommon){
               if(result.indexOf(incommon.name) < 0) {
                   result[result.length] = incommon.name;
               }
           }) 
        });
    }
    return result;
}