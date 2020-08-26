//interface code for counter hacki (hacky api)

let CounterID = [[738178, 738197], [738180, 738602], [738603, 738604], [738605, 738606]]; //CounterID[n][0] == like id; CounterID[n][1] == dislike id
let currentCount = [[0, 0], [0, 0], [0, 0], [0, 0]];
var canVote = true;
var displayedEntry = 0;
//-------------------------------------------------------------------------
//Helper functions
//-------------------------------------------------------------------------
var cors_api_url = 'https://cors-anywhere.herokuapp.com/';
function doCORSRequest(options, printResult) {
    var x = new XMLHttpRequest();
    x.open(options.method, cors_api_url + options.url);
    console.log("cors request with id "+options.IDn);
    x.onload = x.onerror = function() {
        printResult(
            options.method + ' ' + options.url + '\n' +
            x.status + ' ' + x.statusText + '\n\n' +
            (x.responseText || ''), options.IDn
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
//-------------------------------------------------------------------------
//Init functions
//-------------------------------------------------------------------------
function init() {
    var entry = document.getElementsByClassName("entry")[0];
    entry.style.opacity = 1.0;
    entry.style.left = "5%";

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
    canVote = true;
    updateAll();
}
//-------------------------------------------------------------------------
//Interface functions
//-------------------------------------------------------------------------
function nextSlideRight() {
    document.getElementsByClassName("entry")[displayedEntry].style["animation-name"] = "swipe_out_left";
    document.getElementsByClassName("entry")[displayedEntry].style["opacity"] = 0;
    displayedEntry = displayedEntry + 1;
    if (displayedEntry >= document.getElementsByClassName("entry").length) displayedEntry = 0;
    document.getElementsByClassName("entry")[displayedEntry].style["animation-name"] = "swipe_in_right";
}
function nextSlideLeft() {
    document.getElementsByClassName("entry")[displayedEntry].style["animation-name"] = "swipe_out_right";
    document.getElementsByClassName("entry")[displayedEntry].style["opacity"] = 0;
    displayedEntry = displayedEntry - 1;
    if (displayedEntry < 0) displayedEntry = document.getElementsByClassName("entry").length - 1;
    document.getElementsByClassName("entry")[displayedEntry].style["animation-name"] = "swipe_in_left";
}
//-------------------------------------------------------------------------
//Counter functions
//-------------------------------------------------------------------------
function updateAll() {
    for (var i = 0; i < CounterID.length; i++) {
        console.log("updating "+i)
        updateLikeCounter(i);
        updateDislikeCounter(i);
    }
}
function handleLike(IDn) {
    if (getCookie("voted") == "") {
        alert("you already voted");
    } else {
        document.cookie = "voted=true; expires=Tue, 19 Jan 2038 03:14:07 UTC";
        console.log("incrementing counter");
        fetch("https://www.freevisitorcounters.com/en/home/counter/"+CounterID[IDn][0]+"/t/3").then(function(response) {}).then(function(data) {}).catch(function() {});
        updateLikeCounter(IDn);
        updateDislikeCounter(IDn);
    }
}
function updateLikeCounter(IDn) {
    doCORSRequest({
        method: "GET",
        url: "https://www.freevisitorcounters.com/en/home/stats/id/"+CounterID[IDn][0],
        data: "",
        IDn: IDn
    }, writeToLikeCounter);
}
function writeToLikeCounter(unfilteredText, IDn) {
    console.log(unfilteredText);
    console.log("writeToLikeCounter "+IDn);
    var lines = unfilteredText.split('\n');
    for (var i = 0; i < lines.length; i++) {
        if (lines[i] == "<td>All</td>") {
            var hitCount = lines[i+1].substring(lines[i+1].indexOf('>')+1, lines[i+1].lastIndexOf('<'));
            console.log(hitCount);
            document.getElementById("like_counter_"+IDn).innerHTML = hitCount;
            currentCount[IDn][0] = hitCount;
        }
    }
}
function handleDislike(IDn) {
    if (getCookie("voted") == "") {
        alert("you already voted");
    } else {
        document.cookie = "voted=true; expires=Tue, 19 Jan 2038 03:14:07 UTC";
        console.log("incrementing counter");
        fetch("https://www.freevisitorcounters.com/en/home/counter/"+CounterID[IDn][1]+"/t/3").then(function(response) {}).then(function(data) {}).catch(function() {});
        updateLikeCounter(IDn);
        updateDislikeCounter(IDn);
    }
}
function updateDislikeCounter(IDn) {
    doCORSRequest({
        method: "GET",
        url: "https://www.freevisitorcounters.com/en/home/stats/id/"+CounterID[IDn][1],
        data: "",
        IDn: IDn
    }, writeToDislikeCounter);
}
function writeToDislikeCounter(unfilteredText, IDn) {
    console.log("writeToDislikeCounter "+IDn);
    var lines = unfilteredText.split('\n');
    for (var i = 0; i < lines.length; i++) {
        if (lines[i] == "<td>All</td>") {
            var hitCount = lines[i+1].substring(lines[i+1].indexOf('>')+1, lines[i+1].lastIndexOf('<'));
            console.log(hitCount);
            document.getElementById("dislike_counter_"+IDn).innerHTML = hitCount;
            currentCount[IDn][1] = hitCount;
        }
    }
}
//-------------------------------------------------------------------------
//Share box functions
//-------------------------------------------------------------------------
function shareBoxIn() {
    document.getElementById("share_box").style["animation-name"] = "share_box_in";
}
function shareBoxOut() {
    document.getElementById("share_box").style["animation-name"] = "share_box_out";
}
//-------------------------------------------------------------------------