function Userdata(type, data) {
    this.type = type;
    this.data = data;
}

function initializeUserdata() {
    var matches = cm.getUserdata('matches');
    if (matches == null)
        cm.setUserdata('matches',[]);
    var matches = cm.getUserdata('incommon');
    if (matches == null)
        cm.setUserdata('incommon',[]);
    var relations = cm.getUserdata('relations');
    if (relations == null)
        cm.setUserdata('relations',[]);
}
