/// Userdata array is declared in onload.js

function Userdata(type, data) {
    this.type = type;
    this.data = data;
}

function getUserdata(type) {
    var udata = loopUserdata(type);
    if (udata == null)
        return [];
    return udata.data;
}

function setUserdata(type, data) {
    var foundData = loopUserdata(type);
    if (foundData == null) {
      cm.addUserdata(new Userdata(type,data));
    }
}

function loopUserdata(type) {
    for (var i = 0; i < cm.userdata.length; i++) {
        if (cm.userdata[i].type === type) {
            return cm.userdata[i];
        }
    }
    return null;
}

function initializeUserdata() {
    var matches = getUserdata('matches');
    if (matches == null)
        setUserdata('matches',[]);
    var matches = getUserdata('incommon');
    if (matches == null)
        setUserdata('incommon',[]);
    var relations = getUserdata('relations');
    if (relations == null)
        setUserdata('relations',[]);
}
