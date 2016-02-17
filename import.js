var filesToLoad = 0;
var fileCount = 0;
var interval = null;

var FileHandler = React.createClass({
    getInitialState: function() {
        return {
            files: 0,
            selectedKit: null
               }
    },
    importCBdata: function(e) {
        var files = e.target.files;
        filesToLoad = files.length;
        this.setState({ files: filesToLoad });
        interval = setInterval(filesLoaded, 500);
        for (var i = 0; i < files.length; i++) {
            readfile(files[i], i);
        }
    },
    kitChanged: function(e) {
        this.setState({selectedKit: e.target.value});
    },
    importRawData: function(e) {
        if (e.target != null) {
            rawFileReader(e.target.files[0], this.state.selectedKit);
        }
    },
    render: function() {
        return(
            <div  style={styles.main} >
            Choose chromosome data files to import: <br/>
            <input type="file" multiple onChange={this.importCBdata} />
            <h1>{this.state.files}</h1>

            <KitSelector onChange={this.kitChanged}/>
            <input type="file" onChange={this.importRawData} />
            </div>
        );
    }
});


function filesLoaded(){
    if (fileCount == filesToLoad) {
        fileCount = 0;
        clearInterval(interval);
        console.log('ferdig lastet');
    }
}

function readfile(file, filenumber) {
    var reader = new FileReader();

    reader.onload = function (e) {
        var currentKit = null;
        var text = reader.result;
        var result = text.split(/\r\n|\r|\n/g);

        for (var i = 0; i < result.length; i++) {
            currentKit = testLines(result[i], currentKit);
        }
        fileCount++;

        // TODO: fix so we dont get duplicates in kits, must check if kit is already present
        // and only needs an update 
        cm.kits.push(currentKit);
        // kits[kits.length] = currentKit; // saving data in memory

        var transaction = db.transaction(["kits"], "readwrite");
        var store = transaction.objectStore("kits");
        var index = store.index('name');
        var request = index.get(currentKit.name);
        request.onsuccess = function (e) {
            var res = e.target.result;
            if (res) {
                store.put(currentKit);
                console.log('updating ' + currentKit.name);
            } else {
                store.add(currentKit);
                console.log('adding ' + currentKit.name);
            }
        }
        request.onerror = function (e) {
            console.log('errror gitt');
            console.log(e.target.error);
        }
    }
    reader.readAsText(file);
}

function testLines(mystring, kit) {
    var returnvalue = kit;
    if (mystring.charAt(0) == '"') {
        var last = mystring.lastIndexOf('"');
        var names = mystring.substr(1, last - 1);
        var nameArray = names.split('","');
        var data = mystring.substr(last + 2, mystring.length - last + 2);
//        console.log(data);
        var dataArray = data.split(',');
//        console.log(dataArray);

        returnvalue = addChromodata(nameArray, dataArray, kit);
    }
    return returnvalue;
}

function addChromodata(namearray, dataarray, kit) {
    // finner brukernavn, lager ny bruker dersom ikke eksisterer
    kit = updatePerson(namearray[0], kit);
    // finner matchnavn, lager ny match hvis ikke eksisterer
    var mymatch = checkMatch(namearray[1], kit);
    var mydata = checkData(mymatch, dataarray, kit);
    // sjekker om blokken allerede er lagret, legger til paa match om den ikke er det
    return kit;
}

function updatePerson(kitname, kit) {
    if (kit == null)  {
        return new User(kitname);
    }
    if (kit.name != kitname) {
        return new User(kitname);
    }
    return kit;
}

function checkMatch(matchname, kit) {
    for (var i = 0; i<kit.matches.length; i++) {
        if (kit.matches[i].name == matchname) {
            return kit.matches[i];
        }
    }
    var newmatch = new Match(matchname);
    kit.matches[kit.matches.length] = newmatch;
    return newmatch;
}


function rawFileReader(file, kitname){
    var reader = new FileReader();

    reader.onload = function (e) {
        var parsedFile = [];
        var text = reader.result;
        var result = text.split(/\r\n|\r|\n/g);
        for (var i = 0; i < result.length; i++) {
            var parsed = testAutosomal(result[i]);
            if (parsed != null) {
                parsedFile[parsedFile.length] = parsed;
            }
        }

        console.log('about to store data');
        console.log(kitname);

        if (kitname != null) {
            var value = {
                name: kitname,
                data: parsedFile
            };
            cm.addRawdata(value);
            var transaction = db.transaction(["raw"], "readwrite");
            var store = transaction.objectStore("raw");
            var index = store.index('name');
            var request = index.get(kitname);
            request.onsuccess = function (e) {
                var res = e.target.result;
                if (res) {
                    store.put(value);
                    console.log('updating ' + kitname);
                } else {
                    var sjekk = store.add(value);
                    console.log('adding ' + kitname);
                    sjekk.onsuccess = function (e) {
                        console.log('suksess');
                    }

                    sjekk.onerror = function (e) {
                        console.log('ikke sukksess');
                        console.log(e);
                    }
                }
            }
            request.onerror = function (e) {
                console.log('Error gitt');
                console.log(e.target.error);
            }
        }
    }
    reader.readAsText(file);
}


function testAutosomal(mystring){
    var result = null;
    if (mystring.charAt(0) == '"') {
        var stringElements = mystring.split(',');
        for (var i =0; i<stringElements.length; i++){
            stringElements[i] = stripChars(stringElements[i]);
        }
        result = stringElements;
//        var raw = new RawData(stringElements);
//
//        if (raw != null) {
//            userRaw.raw[userRaw.raw.length] = raw;
//        }
    }
    return result;
}

function stripChars(myString){
    // removes first and last char in string
    var newString = myString.substr(1, myString.length - 2);
    return newString;
}
