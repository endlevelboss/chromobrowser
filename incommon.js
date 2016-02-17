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
    var userdata = cm.getUserdataData('incommon');
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
  if (data !== null) {
    for (var i = 0; i < data.length; i++){
        if (data[i].name == name){
            return data[i];
        }
    }
  }
  return null;
}

function findAllIncommon(name) {
    var result = [];
    var userdata = cm.getUserdataData('incommon');
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

function getExclusionList(kitname) {
    var exclusionList = [];
    var relationInfo = findRelation(kitname);
    if (relationInfo != null) {
    if (relationInfo.father != ""){
        exclusionList[exclusionList.length] = relationInfo.father;
      }
    if (relationInfo.mother != "") {
        exclusionList[exclusionList.length] = relationInfo.mother;
      }
    }
    var allRelations = getRelations();
    for (var rel in allRelations) {
        if (allRelations[rel].father == kitname || allRelations[rel].mother == kitname)
            exclusionList[exclusionList.length] = allRelations[rel].name;
    }
    return exclusionList;
}
