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
    var relations = getUserdata('relations');
    cm.kits.map(function(kit) {
        addRelation(kit.name);
    });
    return relations;
}

function addRelation(name) {
    var relations = getUserdata('relations');
    for (var i = 0; i< relations.length; i++) {
        if (relations[i].name == name)
            return;
    }
    relations[relations.length] = new RelationBox(name);
}

function findRelation(name) {
    var relations = getUserdata('relations');
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
