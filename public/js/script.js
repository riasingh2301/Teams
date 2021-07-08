//1:46:05 == Styling

const socket=io('/')

const videocontainer = document.getElementById('video-grid');
const myvideo=document.createElement('video');
const myvideocontainer = document.getElementById('my-video');
myvideo.muted=true;

var peer = new Peer(undefined,{
  path:'/peerjs',
  host:'/',
  port:'443'
}); 

let myVideoStream
navigator.mediaDevices.getUserMedia({
    video:true,
    audio:true
}).then(stream=>{
    myVideoStream=stream;
    addVideoStream1(myvideo, stream);

    socket.on('user-connected',(userId)=>{
      connectingNewUser(userId,stream);
    })
})
function addVideoStream1(video, stream) {
  video.srcObject = stream;
  video.addEventListener('loadedmetadata', () => {
    video.play();
  })
  myvideocontainer.append(video);
}


var getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;
peer.on('call', function(call) {
  getUserMedia({video: true, audio: true}, function(stream) {
      call.answer(stream); // Answer the call with an A/V stream.
      const video=document.createElement('video');
      call.on('stream', userVideoStream =>{
        addVideoStream(video, userVideoStream)
      }); 
  }, function(err) {
    console.log('Failed to get local stream' ,err);
  });
});

//ID gets automatically generated
peer.on('open',id=>{
  socket.emit('join-room',ROOM_ID,id);
})

//I will call user and prvide my vedio stream and add the video stream in his page
const connectingNewUser = (userId,stream) =>{
  const call = peer.call(userId,stream)
  const video=document.createElement('video');
  call.on('stream', userVideoStream =>{
    addVideoStream(video, userVideoStream)
  }); 
}

function addVideoStream(video, stream) {
    video.srcObject = stream;
    video.addEventListener('loadedmetadata', () => {
      video.play();
    })
    videocontainer.append(video);
  }



// input value
let text = $("#chat_message");
//console.log(text);
// when press enter send message
$('html').keydown((e)=>{
  if (e.which == 13 && text.val().length !== 0) {
    console.log(text.val());
    socket.emit('message', text.val());
    text.val('');
  }
});

socket.on('createMessage',(message)=>{
  //console.log('coming frm server ${message}');
  $('ul').append(`<li class="message"><b><i class="fa fa-fw fa-user-circle"></i>${User}</b><br>${message}</li>`);
});

let User='';
// input value
let user = $("#user");
//console.log(text);
// when press enter send message
$('html').keydown((e)=>{
  if (e.which == 13 && user.val().length !== 0) {
    console.log(user.val());
    User=user.val()
    socket.emit('username', user.val());
    user.val('')
  }
});

// MUTE AND VIDEO

const muteUnmute = () => {
  const enabled = myVideoStream.getAudioTracks()[0].enabled;
  console.log(enabled);
  if (enabled) {
    myVideoStream.getAudioTracks()[0].enabled = false;
    setUnmuteButton();
  } else {
    setMuteButton();
    myVideoStream.getAudioTracks()[0].enabled = true;
  }
}

const playStop = () => {
  let enabled = myVideoStream.getVideoTracks()[0].enabled;
  if (enabled) {
    myVideoStream.getVideoTracks()[0].enabled = false;
    setPlayVideo()
  } else {
    setStopVideo()
    myVideoStream.getVideoTracks()[0].enabled = true;
  }
}

const setMuteButton = () => {
  const html = `
    <i class="fa fa-fw fa-microphone"></i>
    <span>Mute</span>
  `
  document.querySelector('#main__mute_button').innerHTML = html;
}

const setUnmuteButton = () => {
  const html = `
    <i class="fa fa-fw fa-microphone-slash"></i>
    <span>Unmute</span>
  `
  document.querySelector('#main__mute_button').innerHTML = html;
}

const setStopVideo = () => {
  const html = `
    <i class="fa fa-fw fa-video"></i>
    <span>Stop Video</span>
  `
  document.querySelector('#main__video_button').innerHTML = html;
}

const setPlayVideo = () => {
  const html = `
  <i class="fa fa-fw fa-video-slash"></i>
    <span>Play Video</span>
  `
  document.querySelector('#main__video_button').innerHTML = html;
}



