const videogrid = document.getElementById('video-grid');
const myvideo = document.createElement('video');
myvideo.muted=true;
const socket= io('/');
var peer = new Peer(undefined , {
    path: '/peerjs',
    host: '/',
    port: '3000'
});


let myvideostream;
navigator.mediaDevices.getUserMedia({
    video: true,
    audio: true
}).then(stream=>{
    myvideostream=stream;
    addvideostream(myvideo, stream);
    peer.on('call', call=>{
        call.answer(stream);
        const video = document.createElement('video');
        call.on('stream', userVideoStream =>{
            addvideostream(video , userVideoStream)
        })
    })
    socket.on('user-connected', (userId , stream)=>{
        connectToNewUser(userId , stream);
    })
})
peer.on('open', id=>{
    socket.emit('join-room' , RoomId , id);
    // console.log(id);
})
// console.log(RoomId);

const connectToNewUser = (userId , stream)=>{
    const call = peer.call(userId, stream);
    const video = document.createElement('video');
    call.on('stream', userVideoStream =>{
        addvideostream(video , userVideoStream)
    })
}

// let connectToNewUser;
// var getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;
// getUserMedia({video: true, audio: true}, connectToNewUser(userId ,stream) =>{
//   var call = peer.call(userId, stream);
//   call.on('stream', userVideoStream=> {
//     addvideostream(video , userVideoStream);
//   })
// }, function(err) {
//   console.log('Failed to get local stream' ,err);
// });

const addvideostream = (video,stream)=>{
    video.srcObject = stream;
    video.addEventListener('loadedmetadata', ()=>{
        video.play();
    })
    videogrid.append(video);
}