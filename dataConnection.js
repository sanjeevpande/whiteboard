var sendChannel, receiveChannel;

function createConnection() {
  var servers = null;
  window.localPeerConnection = new webkitRTCPeerConnection(servers,
    {optional: [{RtpDataChannels: true}]});
  trace('Created local peer connection object localPeerConnection');

  try {
    // Reliable Data Channels not yet supported in Chrome
    sendChannel = localPeerConnection.createDataChannel("sendDataChannel",
      {reliable: false});
    trace('Created send data channel');
  } catch (e) {
    alert('Failed to create data channel. ' +
          'You need Chrome M25 or later with RtpDataChannel enabled');
    trace('createDataChannel() failed with exception: ' + e.message);
  }
  localPeerConnection.onicecandidate = gotLocalCandidate;
  sendChannel.onopen = handleSendChannelStateChange;
  sendChannel.onclose = handleSendChannelStateChange;

  window.remotePeerConnection = new webkitRTCPeerConnection(servers,
    {optional: [{RtpDataChannels: true}]});
  trace('Created remote peer connection object remotePeerConnection');

  remotePeerConnection.onicecandidate = gotRemoteIceCandidate;
  remotePeerConnection.ondatachannel = gotReceiveChannel;

  localPeerConnection.createOffer(gotLocalDescription);
}

createConnection();

function trace(text) {
  console.log((performance.now() / 1000).toFixed(3) + ": " + text);
}

function sendData(data) {
  sendChannel.send(data);
  trace('Sent data: ' + data);
}

function closeDataChannels() {
  trace('Closing data channels');
  sendChannel.close();
  trace('Closed data channel with label: ' + sendChannel.label);
  receiveChannel.close();
  trace('Closed data channel with label: ' + receiveChannel.label);
  localPeerConnection.close();
  remotePeerConnection.close();
  localPeerConnection = null;
  remotePeerConnection = null;
  trace('Closed peer connections');
}

function gotLocalDescription(desc) {
  localPeerConnection.setLocalDescription(desc);
  trace('Offer from localPeerConnection \n' + desc.sdp);
  remotePeerConnection.setRemoteDescription(desc);
  remotePeerConnection.createAnswer(gotRemoteDescription);
}

function gotRemoteDescription(desc) {
  remotePeerConnection.setLocalDescription(desc);
  trace('Answer from remotePeerConnection \n' + desc.sdp);
  localPeerConnection.setRemoteDescription(desc);
}

function gotLocalCandidate(event) {
  trace('local ice callback');
  if (event.candidate) {
    remotePeerConnection.addIceCandidate(event.candidate);
    trace('Local ICE candidate: \n' + event.candidate.candidate);
  }
}

function gotRemoteIceCandidate(event) {
  trace('remote ice callback');
  if (event.candidate) {
    localPeerConnection.addIceCandidate(event.candidate);
    trace('Remote ICE candidate: \n ' + event.candidate.candidate);
  }
}

function gotReceiveChannel(event) {
  trace('Receive Channel Callback');
  receiveChannel = event.channel;
  receiveChannel.onmessage = handleMessage;
  receiveChannel.onopen = handleReceiveChannelStateChange;
  receiveChannel.onclose = handleReceiveChannelStateChange;
}

function handleMessage(event) {
    trace('Received message: ' + event.data);

    console.log("Data recieved");
    
    /*var recievedData = event.data,
        c = document.getElementById("board"),
        ctx = c.getContext("2d");
    
    ctx.lineWidth = 8;
    ctx.lineJoin = 'round';
    ctx.lineCap = 'round';

    ctx.moveTo(recievedData.prevX, recievedData.prevY);
    ctx.lineTo(event.offsetX,event.offsetY);

    if(erase){
        ctx.strokeStyle = '#FFFFFF';
        ctx.lineWidth = 30;    
    }
    else if(write){
        ctx.strokeStyle = '#000000';   
        ctx.lineWidth = 8;
    }

    recievedData.prevX = event.offsetX;
    recievedData.prevY = event.offsetY;

    ctx.stroke();*/ 
}

function handleSendChannelStateChange() {
  var readyState = sendChannel.readyState;
  trace('Send channel state is: ' + readyState);
  if (readyState == "open") {
    
  } else {
    
  }
}

function handleReceiveChannelStateChange() {
  var readyState = receiveChannel.readyState;
  trace('Receive channel state is: ' + readyState);
}