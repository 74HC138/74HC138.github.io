let ID = [737672];
var currentID = 0;
var currentTextID = "";

var cors_api_url = 'https://cors-anywhere.herokuapp.com/';
function doCORSRequest(options, printResult) {
    var x = new XMLHttpRequest();
    x.open(options.method, cors_api_url + options.url);
    x.onload = x.onerror = function() {
        printResult(
            options.method + ' ' + options.url + '\n' +
            x.status + ' ' + x.statusText + '\n\n' +
            (x.responseText || '')
        );
    };
    if (/^POST/i.test(options.method)) {
        x.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    }
    x.send(options.data);
}

var clientIncrement = new HttpClient();
var clientUpdate = new HttpClient();

function handlebutton(IDn, ButtonID) {
    currentID = ID[IDn];
    currentTextID = ButtonID;
    console.log("incrementing counter");
    fetch("https://www.freevisitorcounters.com/en/home/counter/"+currentID+"/t/3").then(function(response) {}).then(function(data) {}).catch(function() {});
    updateCounter(IDn, ButtonID);
}
function updateCounter(IDn, ButtonID) {
    currentID = ID[IDn];
    currentTextID = ButtonID;
    doCORSRequest({
        method: "GET",
        url: "https://www.freevisitorcounters.com/en/home/stats/id/"+currentID,
        data: ""
    }, writeToCounter);
}
function updateAll() {
    let textBox = ["counter"];
    for (var i = 0; i < ID.length; i++) {
        updateCounter(i, textBox[i]);
    }
}
function writeToCounter(unfilteredText) {
    console.log(unfilteredText);
    var lines = unfilteredText.split('\n');
    console.log(lines.length);
    for (var i = 0; i < lines.length; i++) {
        if (lines[i] == "<td>All</td>") {
            console.log("found plaintext hitcount at line "+i);
            var hitCount = lines[i+1].substring(lines[i+1].indexOf('>')+1, lines[i+1].lastIndexOf('<'));
            console.log(hitCount);
            document.getElementById(currentTextID).innerHTML = hitCount;
        }
    }
}