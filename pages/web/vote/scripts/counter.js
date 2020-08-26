let ID = [737672, 738178, 738179, 738180];
var currentID = 0;
var currentTextID = "";
var canVote = true;

var displayedEntry = 0;

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
function getCookie(cname) {
    var name = cname + "=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(';');
    for(var i = 0; i <ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}

function init() {
    var entry = document.getElementsByClassName("entry")[0];
    entry.style.opacity = 1.0;
    entry.style.left = "0%";

    if (getCookie("voted") == "") {
        //cookie not set, not voted yet
        canVote = true;
        document.cookie = "voted=false; expires=Tue, 19 Jan 2038 03:14:07 UTC";
    } else if (getCookie("voted") == "false") {
        //cookie set but ok
        canVote = true;
    } else if (getCookie("voted") == "true") {
        //already voted
        canVote = false;
    }
    updateAll();
}

function nextSlideRight() {
    document.getElementsByClassName("entry")[displayedEntry].style["animation-name"] = "swipe_out_left";
    document.getElementsByClassName("entry")[displayedEntry].style["opacity"] = 0;
    displayedEntry = displayedEntry + 1;
    if (displayedEntry >= document.getElementsByClassName("entry").length) displayedEntry = 0;
    document.getElementsByClassName("entry")[displayedEntry].style["animation-name"] = "swipe_in_right";
}

function handlebutton(IDn, ButtonID) {
    currentID = ID[IDn];
    currentTextID = ButtonID;
    if (getCookie("voted") == "true") {
        alert("you already voted");
    } else {
        document.cookie = "voted=true; expires=Tue, 19 Jan 2038 03:14:07 UTC";
        console.log("incrementing counter");
        fetch("https://www.freevisitorcounters.com/en/home/counter/"+currentID+"/t/3").then(function(response) {}).then(function(data) {}).catch(function() {});
        updateCounter(IDn, ButtonID);
    }
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
    for (var i = 0; i < textBox.length; i++) {
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