var theBuffer = null;
var audioContext = null;
var sourceNode = null;
var analyser = null;
var analyser2 = null;
var javascriptNode;
var splitter = null;
var pause;
var channel = 128;

function drawGraph(array,array2){
    var graph = document.getElementById('audioGraph');
    if (!graph) {
        console.error("audioGraph element not found");
        return;
    }
    var graphWidth = graph.offsetWidth;
    var graphHeight = graph.offsetHeight;

    audioGraph.innerHTML = '';
    var k = array.length; // k is analyser.frequencyBinCount, which is 64
    var numBars = k - 8; // Number of bars to draw, 56 in this case
    if (numBars <= 0) return; // Avoid division by zero or negative bar width

    var gap = 1; // 1px gap between bars
    var barWidth = (graphWidth - (numBars - 1) * gap) / numBars;
    barWidth = Math.max(1, barWidth); // Ensure bar width is at least 1px

    for(var i=8;i<k;i++){ // Loop from 8 to 63 (56 iterations)
        var t = document.createElement("div");
        t.style.position = "absolute";
        
        var barValue = (array[i] + array2[i]) / 2;
        var bar_actual_height = (barValue / 255) * graphHeight;
        
        if (bar_actual_height < 0) bar_actual_height = 0; // Ensure height is not negative
        if (barValue > 0 && bar_actual_height < 1) bar_actual_height = 1; // Minimum height of 1px for non-zero values

        t.style.height = bar_actual_height + "px";
        t.style.width = barWidth + "px";
        t.style.left = (i - 8) * (barWidth + gap) + "px";
        t.style.top = graphHeight - bar_actual_height + "px";
        
        var hue = ((i - 8) / numBars) * 360;
        t.style.background = "hsl(" + hue + ", 100%, 50%)";
        audioGraph.appendChild(t);
    }
}

setup();

function setup(){
	audioContext = new AudioContext();
	
    javascriptNode = audioContext.createScriptProcessor(0);
    javascriptNode.connect(audioContext.destination);

    analyser = audioContext.createAnalyser();
    analyser.smoothingTimeConstant = 0.5;
    analyser.fftSize = channel*2;

    analyser2 = audioContext.createAnalyser();
    analyser2.smoothingTimeConstant = 0.5;
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


