"use strict";
// ContentManager handles the model and informs gui when to update

class DatabaseManager {
  constructor() {
    this.kits = []; // Contains chromobrowser match data
    this.kitRawdata = []; // Contains raw autosomal
    this.userdata = []; // Contains all user data

    this.canvasheight;
    this.canvaswidth;
    this.setCanvas();
    this.comparisonHeight = 8; // height in px of small comparison window
    this.xoffset = 10;
    this.xinneroffset = 25; // chromobackground with 25px padding front and back
    this.yoffset = 25;

    this.markerPosition = 0;

    // Array of callback functions for all registered listeners
    this.callbacks = [];

    this.selectedChromosome = '1'; // Name of selected chromosome
    this.selectedChromoIndex = 0;  // Index of selected chromosome

    this.scale = this.getScale();

    this.selectedCMLimit = 5;

    this.displaymode = 'A'; // Viewselection, defaulting to single user

    this.selectedKits = [];
    this.crossovers = []; // One crossoverlist for each kit


    this.useParentCheckbox = false;

    this.selectedMatch = null; // stores latest selected match in chromobrowser


    // variables storing data defined by displayselection
    this.inCommonWithSelectedMatch = []; // list of matches in common with selected match
    this.matchdata = []; // stores array of sorted data for display in chromobrowser
    this.currentUsers = []; // stores kits involved in current comparison
    this.comparisons = []; // stores comparisons between kits
  }

  initialize() {
    // check if selectedkits is empty, and set default values
    if (this.selectedKits.length == 0 && this.kits.length > 0) {
      this.selectedKits[1] = this.kits[0].name;
      this.selectedKits[2] = this.kits[0].name;
      this.selectedKits[3] = this.kits[0].name;
    }

    this.crossovers = this.getUserdataData('crossovers');
    for (var i = this.crossovers.length - 1; i > -1; i--) {
      if (this.crossovers[i].delete) {
        this.crossovers.splice(i, 1);
      }
    }
  }

  getScale() {
    return this.canvaswidth / chromolength[this.selectedChromoIndex];
  }

  setCanvas() {
    this.canvasheight = window.innerHeight - 100;
    this.canvaswidth = window.innerWidth - 90;
  }

  updateCanvas() {
    this.setCanvas();
    this.update();
  }

  setAncestry(matchname, ancestryname) {
      var match = this.setMatch(matchname);
      this.setCustomdata(match, 'relation', ancestryname);
      this.update();
  }

  setCustomdata(match, type, value) {
      for (var i = 0; i < match.customdata.length; i++) {
          if (match.customdata[i].type == type) {
              match.customdata[i].data = value;
              return;
          }
      }
      match.customdata[match.customdata.length] = new Customdata(type, value);
  }

  setMatch(matchname) {
      var matches = this.getUserdataData('matches');
      for (var i=0; i < matches.length; i++) {
          if (matches[i].name == matchname)
              return matches[i];
      }
      var newmatch = new MatchCustom(matchname);
      matches[matches.length] = newmatch;
      return newmatch;
  }

  getMatch(matchname) {
      var matches = this.getUserdataData('matches');
      for (var i=0; i<matches.length; i++) {
          if (matches[i].name == matchname)
              return matches[i];
      }
      return null;
  }

  getUserdata(type) {
    for (var i = 0; i < this.userdata.length; i++) {
      if (this.userdata[i].type === type) {
        return this.userdata[i];
      }
    }
    return null;
  }

  getUserdataData(type) {
    for (var i = 0; i < this.userdata.length; i++) {
      if (this.userdata[i].type === type) {
        return this.userdata[i].data;
      }
    }
    return null;
  }

  initializeUserdata(type, data) {
    var found = null;
    for (var i = 0; i < this.userdata.length; i++) {
      if (this.userdata[i].type === type) {
        found = this.userdata[i];
      }
    }
    if (found == null) {
      this.userdata.push(new Userdata(type,data));
    }
  }

  replaceUserdata(type, data) {
    for (var i = 0; i < this.userdata.length; i++) {
      if (this.userdata[i].type === type) {
        this.userdata[i].data = data;
      }
    }
  }

  replaceAllUserdata(data) {
    this.userdata = data;
  }



  registerCallback(cbFunction) {
    this.callbacks.push(cbFunction);
  }

  unregisterCallback(cbFunction) {
    var i = this.callbacks.indexOf(cbFunction);
    if (i > -1) {
      this.callbacks[i] = null; // sets element to null, will be removed in update function
    }
  }

  setCMLimit(value) {
    this.selectedCMLimit = value;
    this.update();
  }

  setSelectedMatch(value) {
    this.selectedMatch = value;
    this.update();
  }

  setParentCheckbox(value) {
    this.useParentCheckbox = value;
    this.update();
  }

  setKit(kitid, value) {
    this.selectedKits[kitid] = value;
    this.update();
  }

  setDisplay(mode) {
    this.displaymode = mode;
    this.update();
  }

  setChromosome(chromosome, chromoindex) {
    this.selectedChromosome = chromosome;
    this.selectedChromoIndex = chromoindex;
    this.update();
  }

  addKit(kit) {
    this.kits.push(kit);
  }

  addRawdata(raw) {
    this.kitRawdata.push(raw);
  }

  setMarkerPosition(pos) {
    this.markerPosition = pos;
  }

  getCrossover2(name) {
    var data = [];
    var c = this.selectedChromosome;
    this.crossovers.forEach(function (item) {
      if (item != null) {
        if (item.name == name && item.chromosome == c) {
          data.push(item);
        }
      }
    });
    return data;
  }

  editCrossover(crossoverItem, newPosition) {
    crossoverItem.position = newPosition;
    this.update();
  }

  deleteCrossover(crossoverItem) {
    var index = this.crossovers.indexOf(crossoverItem);
    this.crossovers[index].delete = true;
    this.update();
  }

  setCrossover(rowid, isFather) {
    var kitOwner = this.getKitnameFromRow(rowid);
    this.crossovers.push({name: kitOwner, father: isFather, position: this.markerPosition, chromosome: this.selectedChromosome, delete: false});
    this.update();
  }

  getKitnameFromRow(rowid){
    if (rowid == 1) {
      if (this.displaymode == 'C') {
        return this.selectedKits[1];
      } else {
        return this.selectedKits[2];
      }
    }
    if (rowid == 2) {
      return this.selectedKits[2];
    }
    if (rowid == 3) {
      if (this.displaymode == 'C') {
        return this.selectedKits[2];
      } else {
        return this.selectedKits[3];
      }
    }
    return this.selectedKits[1];
  }

  getKit(name) {
      for (var i = 0; i < cm.kits.length; i++) {
          if (cm.kits[i].name === name) {
              return cm.kits[i];
          }
      }
      return null;
  }

  update() {
    this.scale = this.getScale();

    this.inCommonWithSelectedMatch = findAllIncommon(this.selectedMatch);

    var kit1 = this.getKit(this.selectedKits[1]);
    var kit2 = this.getKit(this.selectedKits[2]);
    var kit3 = this.getKit(this.selectedKits[3]);

    if (this.displaymode == 'A') {
        this.matchdata = [sortChromodata(kit1, this.selectedChromosome)];
        this.currentUsers = [kit1];
        this.comparisons = [];
    }
    else if (this.displaymode == 'B'){
        var data1 = sortChromodata(kit1, this.selectedChromosome);
        var data2 = sortChromodata(kit2, this.selectedChromosome);
        var incommon = findCommonMatches(kit1, kit2);
        var row0 = testInCommon(data1, incommon, true);
        var row1 = testInCommon(data2, incommon, true);
        var kitsCompared = compareKitsInCommon(data1, [kit2], true);
        var raw = compareRawdata(kit1, kit2, this.selectedChromosome);
        this.matchdata = [row0, row1];
        this.currentUsers = [kit1, kit2];
        this.comparisons = [[kitsCompared, raw, 0]];
    }

    else if (this.displaymode == 'C'){
      var data1 = sortChromodata(kit1, this.selectedChromosome);
      var data2 = sortChromodata(kit2, this.selectedChromosome);
      var incommon = findCommonMatches(kit1, kit2);
      var row0 = testInCommon(data1, incommon, false);
      var row1 = testInCommon(data1, incommon, true);
      var row2 = testInCommon(data2, incommon, true);
      var row3 = testInCommon(data2, incommon, false);
      var kitsCompared = compareKitsInCommon(data1, [kit2],true);
      var raw = compareRawdata(kit1, kit2, this.selectedChromosome);
      this.matchdata = [row0, row1, row2, row3];
      this.currentUsers = [kit1, kit1, kit2, kit2];
      this.comparisons = [[kitsCompared, raw, 1]];
    }

    else if (this.displaymode == 'D'){
        var data1 = sortChromodata(kit1, this.selectedChromosome);
        var data2 = sortChromodata(kit2, this.selectedChromosome);
        var data3 = sortChromodata(kit3, this.selectedChromosome);
        var incommon = findCommonMatches(kit1, kit2);
        var incommon2 = findCommonMatches(kit3, kit2);
        var row0 = testInCommon(data1, incommon, true);
        var row1 = testInCommon(data2, incommon, true);
        var row2 = testInCommon(data2, incommon2, true);
        var row3 = testInCommon(data3, incommon2, true);
        var kitsCompared1 = compareKitsInCommon(data1, [kit2],true);
        var raw1 = compareRawdata(kit1, kit2, this.selectedChromosome);
        var kitsCompared2 = compareKitsInCommon(data2, [kit3],true);
        var raw2 = compareRawdata(kit3, kit2, this.selectedChromosome);
        this.matchdata = [row0, row1, row2, row3];
        this.currentUsers = [kit1, kit2, kit2, kit3];
        this.comparisons = [[kitsCompared1, raw1, 0],[kitsCompared2, raw2, 2]];
    }
    else if (this.displaymode == 'E'){
        var data1 = sortChromodata(kit1, this.selectedChromosome);
        var data2 = sortChromodata(kit2, this.selectedChromosome);
        var incommon = findCommonMatches(kit1, kit2);
        var row0 = testInCommon(data1, incommon, false);
        var row1 = testInCommon(data2, incommon, false);
        var kitsCompared = compareKitsInCommon(data1, [kit2],true);
        var raw = compareRawdata(kit1, kit2, this.selectedChromosome);
        this.matchdata = [row0, row1];
        this.currentUsers = [kit1, kit2];
        this.comparisons = [[kitsCompared, raw, 0]];
    }

    // clean up callbacks to remove any elements of value null
    this.callbacks = this.callbacks.filter(function(n){ return n != null });
    this.callbacks.forEach(function(cb) {
      if (cb != null){
        cb.update.apply(cb); // Runs update of each component with apply, to use its own 'this'
      }
    })
  }
}
