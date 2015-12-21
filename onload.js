var kits = []; // Contains chromobrowser match data
var kitRawdata = []; // Contains raw autosomal
var userdata = []; // Contains all user data


function getKit(name) {
    for (var i = 0; i < kits.length; i++) {
        if (kits[i].name === name) {
            return kits[i];
        }
    }
    return null;
}

document.addEventListener('DOMContentLoaded', function () {
    if ('indexedDB' in window) {
        idbSupported = true;
    }

    if (idbSupported) {
        var openRequest = indexedDB.open('chromobrowser', 1);

        openRequest.onupgradeneeded = function (e) {
            console.log('Upgrading...');
            var thisDB = e.target.result;

            if (!thisDB.objectStoreNames.contains('kits')) {
                var objectStore = thisDB.createObjectStore('kits', { keyPath: "name" });
                objectStore.createIndex('name', 'name', { unique: true });
            }
            if (!thisDB.objectStoreNames.contains('raw')) {
                var objectStore = thisDB.createObjectStore('raw', { autoIncrement: true });
                objectStore.createIndex('name', 'name', { unique: true });
            } 
            if (!thisDB.objectStoreNames.contains('reducedraw')) {
                var objectStore = thisDB.createObjectStore('reducedraw');
            }  
        }

        openRequest.onsuccess = function (e) {
            console.log('Starting up!');
            db = e.target.result;
            onStartup();
        }

        openRequest.onerror = function (e) {
            console.log('Error loading data!');
            console.log(e);
        }
    }
}, false);


function onStartup() {
    var transaction = db.transaction(['kits'], "readonly");
    var store = transaction.objectStore('kits');

    var cursor = store.openCursor();
    cursor.onsuccess = function (e) {
        var res = e.target.result;
        if (res) {
            // Loading kits from database
            kits[kits.length] = res.value;
            res.continue();
        } else {
            loadLocalstorage();
            initializeUserdata();
            var transaction = db.transaction(["raw"], "readonly");
            var storeRaw = transaction.objectStore('raw');
            var cursorRaw = storeRaw.openCursor();
            cursorRaw.onsuccess = function (e) {
                var resRaw = e.target.result;
                if (resRaw) {
                    var myraw = resRaw.value;
                    //console.log(myraw);
                    kitRawdata[kitRawdata.length] = myraw;
                    //console.log(kitRawdata);
                    resRaw.continue();
                }
            }
        }
    }
}

window.onbeforeunload = function (e) {
    saveLocalstorage();
}

function loadLocalstorage() {
    var chromobrowserdata = localStorage.chromobrowser;
    if (chromobrowserdata != undefined) {
        //console.log(chromobrowserdata);
        userdata = JSON.parse(chromobrowserdata);
        //console.log(userdata);
    }
}

function saveLocalstorage() {
    localStorage.chromobrowser = JSON.stringify(userdata);
}
