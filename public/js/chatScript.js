
$(function () {
    var socket = io(); 
    const username = document.getElementById("handle").innerHTML;
    const useremail = document.getElementById("emailhandle").innerHTML;
    const room = document.getElementById("roomMember").innerHTML;
    const pic = document.getElementById("profileImage").innerHTML;
    
    //CHAT CODE

    //message from server
    socket.on('message', message=>{
     
      outputMessage(message)
    })

    function outputMessage(message){
      $('#messages').append(`<div class="row"> <div class="receiver">
      <span class="nme">`+ message.username +`</span>
      <div class="message-text"> ` + message.text +`</div> 
      <span class="message-time pull-right">`+message.time+`</span></p></div></div></div></li>`);

      $('#m').val('');
    }

    //welcome message from server
     //message from server
     socket.on('message.welcome', message=>{
     
      welcomeMessage(message)
    })
    function welcomeMessage(message){
      $("#messages").append(`<p class="welcome">`+message.text+`</p>`);
      $('#m').val('');
    }
//Join Chat Room
    socket.emit('joinRoom',{username,room,useremail,pic})
    //Get room and users
    socket.on('roomUsers', ({room, users})=>{
      outputRoomName(room);
      outputUsers(users);
    })
    function outputRoomName (room){
      document.getElementById("roomSection").innerHTML = room; 
    }
 
    function outputUsers (users){
      var joinTime= moment().format('h:mm a')
      var k = users.map(e => '<div class="row sideBar-body"><div class="avatar-icon"> <img src="images/uploads/'+e.pic+'"> </div><div class="col-sm-9 col-xs-9 sideBar-main"> <div class="row"><div class="col-sm-8 col-xs-8 sideBar-name"> <span class="name-meta"><b> '+e.username+'</b></span></div><div class="col-sm-4 col-xs-4 pull-right sideBar-time"> <span class="time-meta pull-right">'+joinTime+' </span>  </div></div></div></div></div>').join("");
      
      document.getElementById("inboxchat").innerHTML = k;     
      
    }
    $('#smsForm').submit(function(e){
      e.preventDefault(); // prevents page reloading
      
      const msg = $('#m').val();
      var time= moment().format('MMM D , h:mm a')
      socket.emit('chatMessage', msg);
      $("#messages").append(`<div class="row"> <div class="col"><div class="sender"><span class="nme">You</span><div class="message-text"> `+msg+`</div><span class="message-time pull-right">`+time+`</span></div></div></div>`);
      $('#m').val('');
      $(".emojionearea-editor").html('');
   
    }); 

    }); 

    