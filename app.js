const express = require('express');
const app = express();
const http = require('http').createServer(app);
const mongoose = require('mongoose');
const expressEjsLayout = require('express-ejs-layouts')
const router = express.Router();
const session = require('express-session');
const flash = require('connect-flash');
const passport = require('passport');
const Chat = require("./schema/chat.js");
const socket = require('socket.io');
const io = socket(http);
const formatMessage = require('./utils/messages')
const {userJoin,getCurrentUser,userLeave,getRoomUsers} = require('./utils/users')
require("./auth/passport")(passport);
const connections =[];
const members=[];


//mongoose
mongoose.connect('mongodb+srv://reborn:sabanane@cluster0.wztky.mongodb.net/chatSystem?retryWrites=true&w=majority',{useNewUrlParser: true, useUnifiedTopology : true})

.then(() => console.log('Mongo Database Connected'))
.catch((err)=> console.log(err));
//static files
app.use(express.static("public"));

//Template Engine
app.set('view engine','ejs');
//BodyParser
app.use(express.urlencoded({extended : false}));
//use express session
app.use(session({
    secret : 'secret123',
    resave : true,
    saveUninitialized : true
   }));
   //initialize passport and passport session
app.use(passport.initialize());
app.use(passport.session());
   //use flash
 app.use(flash()); 
 app.use((req,res,next)=> {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error  = req.flash('error');
next();
})
//Layout
app.use(expressEjsLayout); 
app.set('layout', './layouts/layout');
//Routes
app.use('/',require('./routes/home'));
app.use('/',require('./routes/chat'));
app.use('/',require('./routes/register'));


//SOCKET CONNECTIONS 
io.on('connection', (socket) => {
    connections.push(socket);
    console.log('Connected: %s socket(s) connected', connections.length);
   
//listen to joinRoom
socket.on('joinRoom',({username,room,useremail,pic})=>{
const user = userJoin(socket.id, username, room,useremail,pic);

socket.join(user.room); 
//welcome new user
socket.emit('message.welcome',formatMessage('ZiChat','Welcome to the Chatroom'));
//broadcast when a user connects
socket.broadcast.to(user.room).emit('message.welcome',formatMessage('ZiChat',user.username+' has joined the chat'));
//send users and room info
io.to(user.room).emit('roomUsers',{room:user.room, users:getRoomUsers(user.room)})
})

//listen to chatMessage
socket.on('chatMessage', (msg)=>{
  const user = getCurrentUser(socket.id);
  
    //save chat to database before emit
 const newChat = new Chat({
  name:user.username,                      
  email :user.useremail,
  sms : msg
                  });
newChat.save()
.then((value)=>{
  console.log('chat saved to database')
   })
.catch(value=> console.log(value));
// end save chat code
  socket.broadcast.to(user.room).emit('message',formatMessage(user.username,msg))
})


///----------------END CHAT CODE

   //new user
    socket.on('mgeni', data =>{
      socket.wageni = data;
      members.push(socket.wageni);
      console.log(members);
      updateWageni();
    })
  
    function updateWageni() {
      io.sockets.emit('testing-messo', members);
  }
  
   
    //broadcast a chat message
    socket.on('chat message', (msg) => {
  
      //save chat to database before emit
   const newChat = new Chat({
    name:msg.handle,                      
    email : msg.email,
    sms : msg.messo
                    });
  newChat.save()
  .then((value)=>{
    console.log('chat saved to database')
     })
  .catch(value=> console.log(value));
  // end save chat code
        //console.log('message: ' + msg);
        socket.broadcast.emit('chat message', msg);
      });
  
     
      // when a user disconnects from the chat
    socket.on('disconnect', () => {
      ////------CHAT CODE SMS
      const user = userLeave(socket.id);
      if(user){
              io.to(user.room).emit('message.welcome', formatMessage('ZIBORN', user.username+' has left the chat'));
            //send users and room info
io.to(user.room).emit('roomUsers',{room:user.room, users:getRoomUsers(user.room)})
            }
  
      /////------END CHAT CODE SMS
      members.splice(members.indexOf(socket.wageni), 1);
      updateWageni();
    connections.splice(connections.indexOf(socket),1);
    console.log('Available: %s socket(s) connected', connections.length);;
    });
  });
  


 //listen to server connection
 http.listen(3000, ()=>{
     console.log('Express is running on 3000...')
 }); 