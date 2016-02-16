


function getKit(name) {
    for (var i = 0; i < cm.kits.length; i++) {
        if (cm.kits[i].name === name) {
            return cm.kits[i];
        }
    }
    return null;
}
