function RelationBox(name) {
    this.name = name
    this.xpos = 100;
    this.ypos = 100;
    this.father = '';
    this.mother = '';
    this.isKit = false;
    this.color = '#f0e68c';
}

function getRelations() {
    cm.kits.map(function(kit) {
        addRelation(kit.name);
    });
    var relations = cm.getUserdata('relations');
    return relations.data;
}

function addRelation(name) {
    var relations = cm.getUserdataData('relations');
    for (var i = 0; i< relations.length; i++) {
        if (relations[i].name == name)
            return;
    }
    // cm.addUserdata('relations', new RelationBox(name));
    relations[relations.length] = new RelationBox(name);
}

function findRelation(name) {
    var relations = cm.getUserdataData('relations');
    for (var i = 0; i< relations.length; i++) {
        if (relations[i].name == name) {
            return relations[i];
        }
    }
    return null;
}

function updateRelation(child, parent, isFather) {
    var thisChild = findRelation(child);
    if (thisChild != null) {
        if (isFather) {
            thisChild.father = parent;
        } else {
            thisChild.mother = parent;
        }
    }
}
