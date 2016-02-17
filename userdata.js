function Userdata(type, data) {
    this.type = type;
    this.data = data;
}

function initializeUserdata() {
    var matches = cm.getUserdata('matches');
    if (matches == null)
        cm.initializeUserdata('matches',[]);
    var matches = cm.getUserdata('incommon');
    if (matches == null)
        cm.initializeUserdata('incommon',[]);
    var relations = cm.getUserdata('relations');
    if (relations == null)
        cm.initializeUserdata('relations',[]);
}
