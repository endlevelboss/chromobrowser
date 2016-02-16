// Controlling the flow of the app
var cm = new DatabaseManager(); // creates handler for all data

function runApp() {
  // drawing user interface
  drawGUI();

  // check if we are ready to load indexedDB
  if(document.readyState === "complete") {
    onDocumentReady();
  } else {
    document.addEventListener('DOMContentLoaded', onDocumentReady, false);
  }

}

function drawGUI() {
    React.render(
        <MainWindow kits={null} />, document.getElementById('main')
    )
};


function onDocumentReady() {
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
        }

        openRequest.onsuccess = function (e) {
            db = e.target.result;
            onStartup(); // reading indexedDB to memory
        }

        openRequest.onerror = function (e) {
            console.log('Error loading data!');
            console.log(e);
        }
    }
}


// Reads indexedDB to memory
function onStartup() {
  loadLocalstorage();
  initializeUserdata();

  console.log(cm.userdata);

    var transaction = db.transaction(['kits'], "readonly");
    var store = transaction.objectStore('kits');
    var cursor = store.openCursor();
    cursor.onsuccess = function (e) {
        var res = e.target.result;
        if (res) {
            cm.addKit(res.value);
            res.continue();
        } else {

            var transaction = db.transaction(["raw"], "readonly");
            var storeRaw = transaction.objectStore('raw');
            var cursorRaw = storeRaw.openCursor();
            cursorRaw.onsuccess = function (e) {
                var resRaw = e.target.result;
                if (resRaw) {
                    var myraw = resRaw.value;
                    cm.addRawdata(myraw);
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
      cm.setUserdata(JSON.parse(chromobrowserdata));
        // userdata = JSON.parse(chromobrowserdata);
    }
}

function saveLocalstorage() {
    localStorage.chromobrowser = JSON.stringify(cm.userdata);
}


runApp();
