function User(name) {
    this.name = name;
    this.matches = [];
    this.customData = [];
}

function Match(name) {
    this.name = name;
    this.matchblocks = [];
}

function Data(matchname, chromo, start, end, lngth, snp) {
    this.match = matchname;
    this.chromo = chromo;
    this.start = start;
    this.end = end;
    this.lngth = lngth;
    this.snp = snp;
    this.column = 0;
    this.bigcolumn = 0;
}

function getData(kit, matchname) {
    for (var i = 0; i < kit.length; i++) {
        if (kit[i].name === matchname) {
            return kit[i].matchblocks;
        }
    }
    return null;
}

function checkData(mymatch, dataarray) {
    for (var i = 0; i < mymatch.matchblocks.length; i++) {
        if (mymatch.matchblocks[i].chromo == dataarray[0] && mymatch.matchblocks[i].start == dataarray[1]) {
            return null;
        }
    }
    var mydata = new Data(mymatch.name, dataarray[0], dataarray[1], dataarray[2], dataarray[3], dataarray[4]);
    mymatch.matchblocks[mymatch.matchblocks.length] = mydata;
    return mydata;
}