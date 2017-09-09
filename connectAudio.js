var theBuffer = null;
var audioContext = null;
var sourceNode = null;
var analyser = null;
var analyser2 = null;
var javascriptNode;
var splitter = null;
var pause;
var channel = 64;
var height = 10;

function drawGraph(array,array2){

    audioGraph.innerHTML = '';
    var k = array.length;
    for(var i=8;i<k;i++){
        var t = document.createElement("div");
        t.style.position = "absolute";
        t.style.width = ((array[i]+array2[i])) + "px";
        t.style.height = height + "px";
        t.style.top = 50+((k-i)*height) + "px";
        t.style.background = "red";
        audioGraph.appendChild(t);
    }
}

setup();

function setup(){
	audioContext = new AudioContext();
	
    javascriptNode = audioContext.createScriptProcessor(0);
    javascriptNode.connect(audioContext.destination);

    analyser = audioContext.createAnalyser();
    analyser.smoothingTimeConstant = 0.3;
    analyser.fftSize = channel*2;

    analyser2 = audioContext.createAnalyser();
    analyser2.smoothingTimeConstant = 0.3;
    analyser2.fftSize = channel*2;    
}


window.onload = function() {
	var request = new XMLHttpRequest();
	request.open("GET", "./from-faraway.mp3", true);
	request.responseType = "arraybuffer";
	request.onload = function() {
		audioContext.decodeAudioData(request.response, function(buffer) { 
            theBuffer =  buffer;
            playSound();
		}, onError);
	}
	request.send();
}

var startStamp = 0;
var stopStamp = 0;
var paused = false;

function playSound() {
    sourceNode = audioContext.createBufferSource();
    sourceNode.connect(audioContext.destination);

    splitter = audioContext.createChannelSplitter();
    sourceNode.connect(splitter);

    splitter.connect(analyser,0,0);
    splitter.connect(analyser2,1,0);

    analyser.connect(javascriptNode);

    sourceNode.buffer = theBuffer;
    if(paused == true){
        sourceNode.start(0, stopStamp - startStamp);
        console.log("resume");
        paused =  false;
    }else{ sourceNode.start(0); 
        console.log("start at:" + audioContext.currentTime);
        startStamp = audioContext.currentTime;
    }
}

function stopSound() {
    sourceNode.stop(0);
    console.log("stopped at:" + audioContext.currentTime);
    stopStamp = audioContext.currentTime;
}

function pauseSound() {
    sourceNode.stop(0);
    console.log("paused at:" + audioContext.currentTime);
    stopStamp = audioContext.currentTime;
    paused = true;
}

var onError = function(e){
    console.log(e);
}

javascriptNode.addEventListener("audioprocess", startDraw, false);


function startDraw(){

    var array =  new Uint8Array(analyser.frequencyBinCount);
    analyser.getByteFrequencyData(array);
    
    //var array = new Uint8Array(analyser.fftSize);
    //analyser.getByteTimeDomainData(array);

    var array2 =  new Uint8Array(analyser2.frequencyBinCount);
    analyser2.getByteFrequencyData(array2);

    //var array2 = new Uint8Array(analyser2.fftSize);
    //analyser2.getByteTimeDomainData(array2);
        
	drawGraph(array,array2);
}


